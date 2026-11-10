import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/utils/testUtils";
import { generateAuthUserV1 } from "@/mocks/data/authUser";
import FeasibilityEnquirySidebar from "./FeasibilityEnquirySidebar";

const mockUser = generateAuthUserV1({
    email: "jane.doe@example.com",
    secondary_email: null,
    organisation: "Example Org",
});
const mockSendEnquiry = jest.fn(() => Promise.resolve({}));

jest.mock("@/hooks/useAuth", () => ({
    __esModule: true,
    default: () => ({ user: mockUser }),
}));

jest.mock("@/hooks/usePost", () => ({
    __esModule: true,
    default: () => mockSendEnquiry,
}));

const datasets = [
    { datasetId: 1, teamId: 10, teamName: "Team A", name: "Dataset A" },
];

const textFields = [
    /Project title/,
    /Research aim or question/,
    /Funding/,
    /Potential research benefits/,
];

const fillTextFields = async (value: string) => {
    for (const name of textFields) {
        await userEvent.type(screen.getByRole("textbox", { name }), value);
    }
};

const getRadio = (field: string, value: string) =>
    screen
        .getAllByRole("radio", { name: value })
        .find(radio => radio.getAttribute("name") === field) as HTMLElement;

const answerRadios = async () => {
    await userEvent.click(getRadio("other_datasets", "Yes"));
    await userEvent.click(getRadio("dataset_parts_known", "No"));
};

describe("FeasibilityEnquirySidebar", () => {
    beforeEach(() => {
        mockSendEnquiry.mockClear();
    });

    it("does not submit whitespace-only answers", async () => {
        render(<FeasibilityEnquirySidebar datasets={datasets} />);

        await fillTextFields("   ");
        await answerRadios();
        await userEvent.click(
            screen.getByRole("button", { name: "Send message" })
        );

        expect(
            await screen.findByText("Project title is a required field")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Research aim or question is a required field")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Funding is a required field")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Potential research benefits is a required field")
        ).toBeInTheDocument();
        expect(mockSendEnquiry).not.toHaveBeenCalled();
    });

    it("submits only the feasibility enquiry fields", async () => {
        render(<FeasibilityEnquirySidebar datasets={datasets} />);

        await fillTextFields("  Answer  ");
        await answerRadios();
        await userEvent.click(
            screen.getByRole("button", { name: "Send message" })
        );

        await waitFor(() =>
            expect(mockSendEnquiry).toHaveBeenCalledWith({
                from: "jane.doe@example.com",
                organisation: "Example Org",
                contact_number: "",
                project_title: "Answer",
                research_aim: "Answer",
                other_datasets: "Yes",
                dataset_parts_known: "No",
                funding: "Answer",
                potential_research_benefit: "Answer",
                datasets: [
                    { dataset_id: 1, team_id: 10, interest_type: "PRIMARY" },
                ],
                is_dar_dialogue: false,
                is_dar_status: false,
                is_feasibility_enquiry: true,
                is_general_enquiry: false,
            })
        );
    });
});
