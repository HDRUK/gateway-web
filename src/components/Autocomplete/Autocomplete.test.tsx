import { Control, useForm, useWatch } from "react-hook-form";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@/utils/testUtils";
import Autocomplete from "./Autocomplete";

describe("Autocomplete", () => {
    const colors = [
        { value: "red", label: "Red" },
        { value: "blue", label: "Blue" },
        { value: "yellow", label: "Yellow" },
    ];

    const WrapperComponent = () => {
        const { control } = useForm<{ fieldName: string }>();

        return (
            <Autocomplete
                control={control}
                label="Select an option"
                placeholder="Type here"
                name="fieldName"
                options={colors}
            />
        );
    };

    it("should render component", async () => {
        render(<WrapperComponent />);
        expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    describe("tag overflow", () => {
        const ROW_HEIGHT = 28;

        const createValues = (total: number) =>
            Array.from({ length: total }, (_, index) => `10.1000/doi${index}`);

        const mockRowsOf = (tagsPerRow: number) => {
            Object.defineProperty(HTMLElement.prototype, "offsetTop", {
                configurable: true,
                get(this: HTMLElement) {
                    const tags = Array.from(
                        document.querySelectorAll(`.${autocompleteClasses.tag}`)
                    );
                    const index = tags.indexOf(this);

                    return index < 0
                        ? 0
                        : Math.floor(index / tagsPerRow) * ROW_HEIGHT;
                },
            });
        };

        afterEach(() => {
            Reflect.deleteProperty(HTMLElement.prototype, "offsetTop");
            jest.useRealTimers();
        });

        const CurrentValue = ({
            control,
        }: {
            control: Control<{ fieldName: string[] }>;
        }) => {
            const value = useWatch({ control, name: "fieldName" });

            return <div data-testid="current-value">{value.join(",")}</div>;
        };

        const MultipleWrapper = ({ values }: { values: string[] }) => {
            const { control } = useForm<{ fieldName: string[] }>({
                defaultValues: { fieldName: values },
            });

            return (
                <>
                    <Autocomplete
                        control={control}
                        label="Publication using the dataset"
                        name="fieldName"
                        multiple
                        freeSolo
                    />
                    <CurrentValue control={control} />
                </>
            );
        };

        it("should render every value when the layout cannot be measured", () => {
            render(<MultipleWrapper values={createValues(46)} />);

            expect(screen.getByText("10.1000/doi45")).toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: /more$/ })
            ).not.toBeInTheDocument();
        });

        it("should render every value when it fits within the row limit", () => {
            mockRowsOf(6);
            render(<MultipleWrapper values={createValues(24)} />);

            expect(screen.getByText("10.1000/doi23")).toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: /more$/ })
            ).not.toBeInTheDocument();
        });

        it("should collapse to the rows that fit and count the remainder", () => {
            mockRowsOf(6);
            render(<MultipleWrapper values={createValues(46)} />);

            expect(
                screen.getByRole("button", { name: "+ 17 more" })
            ).toBeInTheDocument();
            expect(screen.getByText("10.1000/doi28")).toBeInTheDocument();
            expect(screen.queryByText("10.1000/doi29")).not.toBeInTheDocument();
        });

        it("should reveal and re-hide every value when toggled", async () => {
            mockRowsOf(6);
            render(<MultipleWrapper values={createValues(46)} />);

            await userEvent.click(
                screen.getByRole("button", { name: "+ 17 more" })
            );

            expect(screen.getByText("10.1000/doi45")).toBeInTheDocument();

            const toggle = screen.getByRole("button", { name: "Show fewer" });
            expect(toggle).toHaveAttribute("aria-expanded", "true");

            await userEvent.click(toggle);

            expect(screen.queryByText("10.1000/doi45")).not.toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "+ 17 more" })
            ).toBeInTheDocument();
        });

        it("should re-measure once the window resize settles", () => {
            jest.useFakeTimers();
            mockRowsOf(6);
            render(<MultipleWrapper values={createValues(46)} />);

            expect(
                screen.getByRole("button", { name: "+ 17 more" })
            ).toBeInTheDocument();

            act(() => {
                mockRowsOf(4);
                window.innerWidth = 600;
                window.dispatchEvent(new Event("resize"));
            });

            expect(
                screen.getByRole("button", { name: "+ 17 more" })
            ).toBeInTheDocument();

            act(() => {
                jest.advanceTimersByTime(200);
            });

            expect(
                screen.getByRole("button", { name: "+ 27 more" })
            ).toBeInTheDocument();
        });

        it("should measure only once while a resize is in progress", () => {
            jest.useFakeTimers();
            mockRowsOf(6);
            render(<MultipleWrapper values={createValues(46)} />);

            act(() => {
                mockRowsOf(4);

                for (let step = 0; step < 30; step += 1) {
                    window.innerWidth = 1200 - step * 10;
                    window.dispatchEvent(new Event("resize"));
                    jest.advanceTimersByTime(16);
                }
            });

            expect(
                screen.getByRole("button", { name: "+ 17 more" })
            ).toBeInTheDocument();

            act(() => {
                jest.advanceTimersByTime(200);
            });

            expect(
                screen.getByRole("button", { name: "+ 27 more" })
            ).toBeInTheDocument();
        });

        it("should ignore a resize that leaves the width unchanged", () => {
            jest.useFakeTimers();
            mockRowsOf(6);
            render(<MultipleWrapper values={createValues(46)} />);

            act(() => {
                mockRowsOf(4);
                window.dispatchEvent(new Event("resize"));
                jest.advanceTimersByTime(200);
            });

            expect(
                screen.getByRole("button", { name: "+ 17 more" })
            ).toBeInTheDocument();
        });

        it("should allow an overflowing value to be deleted once revealed", async () => {
            mockRowsOf(6);
            render(<MultipleWrapper values={createValues(46)} />);

            await userEvent.click(
                screen.getByRole("button", { name: "+ 17 more" })
            );

            const chip = screen
                .getByText("10.1000/doi30")
                .closest(".MuiChip-root") as HTMLElement;

            await userEvent.click(
                chip.querySelector(".MuiChip-deleteIcon") as HTMLElement
            );

            expect(screen.getByTestId("current-value")).toHaveTextContent(
                createValues(46)
                    .filter(value => value !== "10.1000/doi30")
                    .join(",")
            );
        });
    });
});
