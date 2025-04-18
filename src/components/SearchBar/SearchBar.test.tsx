import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import SearchBar, { TEST_ID_RESET_BUTTON, TEST_ID_WRAPPER } from "./SearchBar";

describe("SearchBar", () => {
    const onSubmit = jest.fn();
    const onReset = jest.fn();
    const EXPLAINER_TEXT = "Search by keywords, phenotypes, ICD10 codes";
    const QUERY_DEFAULT_TEXT = "Query";

    const WrapperComponent = () => {
        return (
            <SearchBar
                defaultValue={QUERY_DEFAULT_TEXT}
                explainerText={EXPLAINER_TEXT}
                resetAction={onReset}
                submitAction={onSubmit}
                queryPlaceholder="Enter your search term"
                queryName="query"
                isDisabled={false}
            />
        );
    };

    it("should render search bar content", async () => {
        render(<WrapperComponent />);
        expect(screen.getByTestId(TEST_ID_WRAPPER)).toBeInTheDocument();
    });

    it("should render explainer text", async () => {
        render(<WrapperComponent />);
        expect(screen.getByText(EXPLAINER_TEXT)).toBeInTheDocument();
    });

    it("should call submitAction", async () => {
        render(<WrapperComponent />);

        const input = screen.getByDisplayValue(QUERY_DEFAULT_TEXT);

        await userEvent.type(input, "Search Query");
        await userEvent.type(input, "{Enter}");

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
    });

    it("should call resetAction", async () => {
        render(<WrapperComponent />);

        fireEvent.click(screen.getByTestId(TEST_ID_RESET_BUTTON));

        expect(onReset).toHaveBeenCalled();
    });
});
