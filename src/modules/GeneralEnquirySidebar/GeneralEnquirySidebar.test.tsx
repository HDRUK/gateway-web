import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/utils/testUtils";
import { generateAuthUserV1 } from "@/mocks/data/authUser";
import GeneralEnquirySidebar from "./GeneralEnquirySidebar";

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

describe("GeneralEnquirySidebar", () => {
    beforeEach(() => {
        mockSendEnquiry.mockClear();
    });

    it("does not submit a whitespace-only enquiry", async () => {
        render(<GeneralEnquirySidebar datasets={datasets} />);

        await userEvent.type(
            screen.getByRole("textbox", { name: /Your enquiry/ }),
            "   "
        );
        await userEvent.click(
            screen.getByRole("button", { name: "Send message" })
        );

        expect(
            await screen.findByText("Your enquiry is a required field")
        ).toBeInTheDocument();
        expect(mockSendEnquiry).not.toHaveBeenCalled();
    });

    it("submits only the general enquiry fields", async () => {
        render(<GeneralEnquirySidebar datasets={datasets} />);

        await userEvent.type(
            screen.getByRole("textbox", { name: /Your enquiry/ }),
            "  A question  "
        );
        await userEvent.click(
            screen.getByRole("button", { name: "Send message" })
        );

        await waitFor(() =>
            expect(mockSendEnquiry).toHaveBeenCalledWith({
                from: "jane.doe@example.com",
                organisation: "Example Org",
                query: "A question",
                project_title: "",
                contact_number: "",
                datasets: [
                    { dataset_id: 1, team_id: 10, interest_type: "PRIMARY" },
                ],
                is_dar_dialogue: false,
                is_dar_status: false,
                is_feasibility_enquiry: false,
                is_general_enquiry: true,
            })
        );
    });
});
