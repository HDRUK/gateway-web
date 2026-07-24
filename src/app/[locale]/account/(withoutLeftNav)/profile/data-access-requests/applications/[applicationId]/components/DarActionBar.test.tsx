import { render, screen, waitFor, within } from "@/utils/testUtils";
import { DarActionBar } from "./DarActionBar";
import useGet from "@/hooks/useGet";

const defaultProps = {
    applicationId: "123",
    saveDraftOnClick: jest.fn(),
    submitOnClick: jest.fn(),
    manageApplicationOnStatus: jest.fn(),
    isResearcher: true,
    showSaveDraft: true,
};

const mockData = {
    project_title: "My Research Project",
    submission_status: "DRAFT",
    updated_at: "2024-01-15T00:00:00Z",
    primary_applicant: {
        name: "Jane Doe",
        organisation: "University of Dundee",
    },
    datasets: [
        { dataset_id: "1", dataset_title: "Dataset Alpha" },
        { dataset_id: "2", dataset_title: "Dataset Beta" },
    ],
    teams: [{ team_id: 1, approval_status: "APPROVED" }],
};

const mockFetch = (data: unknown, ok = true) => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok,
            headers: {
                get: () => "application/json",
            },
            json: () => Promise.resolve({ data }),
        })
    ) as jest.Mock;
};

describe("DarActionBar", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the project title", async () => {
        mockFetch(mockData);
        render(<DarActionBar {...defaultProps} />);
        expect(await screen.findByText("My Research Project")).toBeInTheDocument();
    });

    it("renders dataset chips", async () => {
        mockFetch(mockData);
        render(<DarActionBar {...defaultProps} />);
        expect(await screen.findByText("Dataset Alpha")).toBeInTheDocument();
        expect(await screen.findByText("Dataset Beta")).toBeInTheDocument();
    });

    it("renders the save draft button when showSaveDraft is true", async () => {
        mockFetch(mockData);
        render(<DarActionBar {...defaultProps} />);
        expect(
            await screen.findByRole("button", { name: "Save draft" })
        ).toBeInTheDocument();
    });

    it("does not render the save draft button when showSaveDraft is false", async () => {
        mockFetch(mockData);
        render(<DarActionBar {...defaultProps} showSaveDraft={false} />);
        expect(await screen.findByText("My Research Project")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Save draft" })
        ).not.toBeInTheDocument();
    });
})