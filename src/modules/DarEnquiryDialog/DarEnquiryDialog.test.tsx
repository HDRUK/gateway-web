import { fireEvent, render, screen } from "@/utils/testUtils";
import DarEnquiryDialog, { DarEnquiryDialogProps } from "./DarEnquiryDialog";

const mockGeneralEnquiryClick = jest.fn();
const mockFeasibilityEnquiryClick = jest.fn();

const renderTest = (props?: Partial<DarEnquiryDialogProps>) =>
    render(
        <DarEnquiryDialog
            onFeasibilityEnquiryClick={mockFeasibilityEnquiryClick}
            onGeneralEnquiryClick={mockGeneralEnquiryClick}
            isDarEnabled
            {...props}
        />
    );

describe("<DarEnquiryDialog />", () => {
    it("has the correct content when is_question_bank=1", () => {
        renderTest();

        expect(
            screen.getByText("This feature is temporarily unavailable")
        ).toBeInTheDocument();
    });

    it("has the correct content when is_question_bank=0", () => {
        renderTest({
            isDarEnabled: false,
        });

        expect(
            screen.getByText(
                "Data access requests not enabled for this Data Custodian"
            )
        ).toBeInTheDocument();
    });

    it("calls the feasibility enquiry dialog", () => {
        renderTest();

        const feasibilityButton = screen.getByRole("button", {
            name: "Make feasibility enquiry for this dataset",
        });

        fireEvent.click(feasibilityButton);

        expect(mockFeasibilityEnquiryClick).toHaveBeenCalled();
    });

    it("calls the general enquiry dialog", () => {
        renderTest();

        const generalButton = screen.getByRole("button", {
            name: "Make general enquiry for this dataset",
        });

        fireEvent.click(generalButton);

        expect(mockGeneralEnquiryClick).toHaveBeenCalled();
    });
});
