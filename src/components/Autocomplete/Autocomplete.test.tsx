import { Control, useForm, useWatch } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/utils/testUtils";
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
        const createValues = (total: number) =>
            Array.from({ length: total }, (_, index) => `10.1000/doi${index}`);

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

        it("should render every value when within the limit", () => {
            render(<MultipleWrapper values={createValues(30)} />);

            expect(screen.getByText("10.1000/doi29")).toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: /more$/ })
            ).not.toBeInTheDocument();
        });

        it("should collapse the values beyond the limit behind a toggle", () => {
            render(<MultipleWrapper values={createValues(46)} />);

            expect(
                screen.getByRole("button", { name: "+ 16 more" })
            ).toBeInTheDocument();
            expect(screen.getByText("10.1000/doi29")).toBeInTheDocument();
            expect(screen.queryByText("10.1000/doi30")).not.toBeInTheDocument();
        });

        it("should reveal and re-hide every value when toggled", async () => {
            render(<MultipleWrapper values={createValues(46)} />);

            await userEvent.click(
                screen.getByRole("button", { name: "+ 16 more" })
            );

            expect(screen.getByText("10.1000/doi45")).toBeInTheDocument();

            const toggle = screen.getByRole("button", { name: "Show fewer" });
            expect(toggle).toHaveAttribute("aria-expanded", "true");

            await userEvent.click(toggle);

            expect(screen.queryByText("10.1000/doi45")).not.toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "+ 16 more" })
            ).toBeInTheDocument();
        });

        it("should allow an overflowing value to be deleted once revealed", async () => {
            render(<MultipleWrapper values={createValues(46)} />);

            await userEvent.click(
                screen.getByRole("button", { name: "+ 16 more" })
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
