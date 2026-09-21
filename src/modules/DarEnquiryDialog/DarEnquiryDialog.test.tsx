import { fireEvent, render, screen } from "@/utils/testUtils";
import DarEnquiryDialog, { DarEnquiryDialogProps } from "./DarEnquiryDialog";

const mockGeneralEnquiryClick = jest.fn();
const mockFeasibilityEnquiryClick = jest.fn();
const mockCreateDARApplication = jest.fn();

const renderTest = (props?: Partial<DarEnquiryDialogProps>) =>
    render(
        <DarEnquiryDialog
            onFeasibilityEnquiryClick={mockFeasibilityEnquiryClick}
            onGeneralEnquiryClick={mockGeneralEnquiryClick}
            createDARApplication={mockCreateDARApplication}
            isDarEnabled
            hasPublishedDarTemplate={false}
            teamName="Test team"
            url=""
            datasetIds={[1]}
            teamIds={[1]}
            {...props}
        />
    );

describe("<DarEnquiryDialog />", () => {
    it("has the correct content when is_question_bank=1", () => {
        renderTest();

        expect(
            screen.getByText(
                "The Data Custodian for this dataset has not yet enabled data access requests via the Gateway. Please select the Access Information button below to proceed to the dataset metadata page."
            )
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

    it("has the correct content when modalContent is provided", () => {
        const modalContent = "This is some lovely content";
        renderTest({
            modalContent,
        });

        expect(screen.getByText(modalContent)).toBeInTheDocument();
    });

    it("has the correct header when modalHeader is provided", () => {
        const modalHeader = "This is a lovely header";
        renderTest({
            modalHeader,
        });

        expect(screen.getByText(modalHeader)).toBeInTheDocument();
    });

    it("calls the feasibility enquiry dialog", () => {
        renderTest({
            isDarEnabled: false,
        });

        const feasibilityButton = screen.getByLabelText("feasibility");

        fireEvent.click(feasibilityButton);

        expect(mockFeasibilityEnquiryClick).toHaveBeenCalled();
    });

    it("calls the general enquiry dialog", () => {
        renderTest({
            isDarEnabled: false,
        });

        const generalButton = screen.getByLabelText("general");

        fireEvent.click(generalButton);

        expect(mockGeneralEnquiryClick).toHaveBeenCalled();
    });

    it("links the access information button to the data access request section", () => {
        renderTest({ url: "/dataset/123" });

        expect(
            screen.getByRole("link", { name: "Access information" })
        ).toHaveAttribute("href", "/dataset/123#anchor-DataAccessRequest");
    });

    it("scrolls to the data access request section when already on the page", () => {
        const section = document.createElement("div");
        section.id = "anchor-DataAccessRequest";
        section.scrollIntoView = jest.fn();
        document.body.appendChild(section);

        renderTest({ url: "/dataset/123" });

        fireEvent.click(
            screen.getByRole("link", { name: "Access information" })
        );

        expect(section.scrollIntoView).toHaveBeenCalledWith({
            behavior: "smooth",
        });

        document.body.removeChild(section);
    });
});
