import { useEffect } from "react";
import { FileUpload } from "@/interfaces/FileUpload";
import { render, screen, waitFor } from "@/utils/testUtils";
import { generateDataUse } from "@/mocks/data";
import { getTeamDataUseV2 } from "@/mocks/handlers/teams/v2";
import { server } from "@/mocks/server";
import CreateDataUse from "./CreateDataUse";

type UploadFileMockProps = {
    onFileUploaded?: (upload: Partial<FileUpload>) => void;
};

const MOCK_PROJECT_TITLE = "Sample project title 29 Oct";
const MOCK_DUR_ID = 123;
const TEAM_ID = "1";

const mockDataUse = generateDataUse({
    id: MOCK_DUR_ID,
    project_title: MOCK_PROJECT_TITLE,
});

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock UploadFile with toggleable behavior
let triggerUpload = false;

jest.mock("@/components/UploadFile", () => ({
    __esModule: true,
    default: ({ onFileUploaded }: UploadFileMockProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (triggerUpload) {
                onFileUploaded?.({ entity_id: MOCK_DUR_ID });
            }
        }, [onFileUploaded]);

        return <div data-testid="mock-upload-file" />;
    },
}));

describe("DataUseCreate", () => {
    beforeEach(() => {
        triggerUpload = false;
    });

    it("renders download and upload components initially", () => {
        render(<CreateDataUse teamId={TEAM_ID} />);

        expect(
            screen.getByText(/Download the data use template/i)
        ).toBeInTheDocument();
        expect(screen.getByTestId("mock-upload-file")).toBeInTheDocument();
    });

    it("renders fetched DUR content after upload", async () => {
        triggerUpload = true;
        server.use(getTeamDataUseV2(MOCK_DUR_ID, mockDataUse));

        render(<CreateDataUse teamId={TEAM_ID} />);

        await waitFor(() => {
            expect(
                screen.getAllByText(MOCK_PROJECT_TITLE).length
            ).toBeGreaterThan(0);
        });
    });

    it("handles failed fetch with no crash", async () => {
        triggerUpload = true;
        server.use(getTeamDataUseV2(MOCK_DUR_ID, undefined, 500));

        render(<CreateDataUse teamId={TEAM_ID} />);

        await waitFor(() => {
            expect(
                screen.queryByText(/Return to Data Uses/i)
            ).not.toBeInTheDocument();
        });
    });
});
