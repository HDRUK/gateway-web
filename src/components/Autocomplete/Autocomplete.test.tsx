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

    describe("selecting without a default value", () => {
        const duoCodes = [
            {
                value: "DUO:0000042",
                label: "DUO:0000042 (general research use)",
            },
            {
                value: "DUO:0000021",
                label: "DUO:0000021 (ethics approval required)",
            },
        ];

        const getChipLabel = (
            options: { value: string | number; label: string }[],
            selected: unknown
        ) =>
            options.find(option => option.value === selected)?.label ??
            String(selected ?? "");

        const CurrentValue = ({
            control,
        }: {
            control: Control<{ fieldName?: string[] }>;
        }) => {
            const value = useWatch({ control, name: "fieldName" });

            return <div data-testid="current-value">{value?.join(",")}</div>;
        };

        const UncontrolledWrapper = () => {
            const { control } = useForm<{ fieldName?: string[] }>();

            return (
                <>
                    <Autocomplete
                        control={control}
                        label="GA4GH Data Use Ontology (DUO) codes"
                        name="fieldName"
                        options={duoCodes}
                        getChipLabel={getChipLabel}
                        multiple
                    />
                    <CurrentValue control={control} />
                </>
            );
        };

        const select = async (label: string) => {
            await userEvent.click(screen.getByRole("combobox"));
            await userEvent.click(screen.getByRole("option", { name: label }));
        };

        it("should show the selected option's label on its chip", async () => {
            render(<UncontrolledWrapper />);

            await select("DUO:0000042 (general research use)");

            expect(
                screen.getByText("DUO:0000042 (general research use)", {
                    selector: ".MuiChip-label",
                })
            ).toBeInTheDocument();
            expect(
                screen.queryByText("[object Object]")
            ).not.toBeInTheDocument();
        });

        it("should keep chips in step with the form value when one is removed", async () => {
            render(<UncontrolledWrapper />);

            await select("DUO:0000042 (general research use)");
            await select("DUO:0000021 (ethics approval required)");

            const chip = screen
                .getByText("DUO:0000042 (general research use)", {
                    selector: ".MuiChip-label",
                })
                .closest(".MuiChip-root") as HTMLElement;

            await userEvent.click(
                chip.querySelector(".MuiChip-deleteIcon") as HTMLElement
            );

            expect(screen.getByTestId("current-value")).toHaveTextContent(
                "DUO:0000021"
            );
            expect(
                screen.getAllByText(/^DUO:/, { selector: ".MuiChip-label" })
            ).toHaveLength(1);
            expect(
                screen.getByText("DUO:0000021 (ethics approval required)", {
                    selector: ".MuiChip-label",
                })
            ).toBeInTheDocument();
        });

        it("should mark a chosen option as selected when the list is reopened", async () => {
            render(<UncontrolledWrapper />);

            await select("DUO:0000042 (general research use)");
            await userEvent.click(screen.getByRole("combobox"));

            expect(
                screen.getByRole("option", {
                    name: "DUO:0000042 (general research use)",
                })
            ).toHaveAttribute("aria-selected", "true");
        });
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
            render(<MultipleWrapper values={createValues(20)} />);

            expect(screen.getByText("10.1000/doi19")).toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: /more$/ })
            ).not.toBeInTheDocument();
        });

        it("should collapse the values beyond the limit behind a toggle", () => {
            render(<MultipleWrapper values={createValues(46)} />);

            expect(
                screen.getByRole("button", { name: "+ 26 more" })
            ).toBeInTheDocument();
            expect(screen.getByText("10.1000/doi19")).toBeInTheDocument();
            expect(screen.queryByText("10.1000/doi20")).not.toBeInTheDocument();
        });

        it("should reveal and re-hide every value when toggled", async () => {
            render(<MultipleWrapper values={createValues(46)} />);

            await userEvent.click(
                screen.getByRole("button", { name: "+ 26 more" })
            );

            expect(screen.getByText("10.1000/doi45")).toBeInTheDocument();

            const toggle = screen.getByRole("button", { name: "Show fewer" });
            expect(toggle).toHaveAttribute("aria-expanded", "true");

            await userEvent.click(toggle);

            expect(screen.queryByText("10.1000/doi45")).not.toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "+ 26 more" })
            ).toBeInTheDocument();
        });

        it("should allow an overflowing value to be deleted once revealed", async () => {
            render(<MultipleWrapper values={createValues(46)} />);

            await userEvent.click(
                screen.getByRole("button", { name: "+ 26 more" })
            );

            const chip = screen
                .getByText("10.1000/doi20")
                .closest(".MuiChip-root") as HTMLElement;

            await userEvent.click(
                chip.querySelector(".MuiChip-deleteIcon") as HTMLElement
            );

            expect(screen.getByTestId("current-value")).toHaveTextContent(
                createValues(46)
                    .filter(value => value !== "10.1000/doi20")
                    .join(",")
            );
        });
    });
});
