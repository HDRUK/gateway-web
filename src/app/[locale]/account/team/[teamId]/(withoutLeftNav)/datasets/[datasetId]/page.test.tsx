import { render, screen } from "@/utils/testUtils";
import TeamDatasetPage from "./page";

const mockIsSchemaOnboardingFormEnabled = jest.fn().mockResolvedValue(false);
jest.mock("@/flags", () => ({
    isSchemaOnboardingFormEnabled: () => mockIsSchemaOnboardingFormEnabled(),
}));

const mockSchemaDatasetFormPage = jest.fn();
jest.mock("../_schema/SchemaDatasetFormPage", () => ({
    __esModule: true,
    default: (props: unknown) => mockSchemaDatasetFormPage(props),
}));

jest.mock("../components/CreateDataset", () => ({
    __esModule: true,
    default: () => <div>existing form</div>,
}));

jest.mock("@/components/ProtectedAccountRoute", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => children,
}));

const mockGetTeamDataset = jest.fn();
jest.mock("@/utils/api", () => ({
    getUser: jest.fn().mockResolvedValue({ id: 1, roles: [] }),
    getTeam: jest.fn().mockResolvedValue({ users: [] }),
    getTeamDataset: () => mockGetTeamDataset(),
    getTeamIdFromPid: jest.fn().mockResolvedValue("1"),
    getSchemaFromTraser: jest.fn().mockResolvedValue({ schema: { $defs: {} } }),
    getFormHydration: jest.fn().mockResolvedValue({ defaultValues: {} }),
}));

describe("TeamDatasetPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetTeamDataset.mockResolvedValue({ versions: [] });
    });

    describe("SchemaOnboardingForm feature flag", () => {
        it("renders the existing form when the flag is off", async () => {
            mockIsSchemaOnboardingFormEnabled.mockResolvedValueOnce(false);

            const JSX = await TeamDatasetPage({
                params: Promise.resolve({
                    teamId: "1",
                    datasetId: "7",
                    status: "",
                }),
                searchParams: Promise.resolve({}),
            });

            render(JSX);
            expect(screen.getByText("existing form")).toBeInTheDocument();
            expect(mockSchemaDatasetFormPage).not.toHaveBeenCalled();
        });

        it("renders the schema-driven form, at the same URL, when the flag is on", async () => {
            mockIsSchemaOnboardingFormEnabled.mockResolvedValueOnce(true);
            mockSchemaDatasetFormPage.mockReturnValueOnce(
                <div>schema form</div>
            );

            const JSX = await TeamDatasetPage({
                params: Promise.resolve({
                    teamId: "1",
                    datasetId: "7",
                    status: "",
                }),
                searchParams: Promise.resolve({
                    status: "DRAFT",
                    duplicate: "true",
                }),
            });

            expect(mockSchemaDatasetFormPage).toHaveBeenCalledWith({
                teamId: "1",
                datasetId: "7",
                model: undefined,
                version: undefined,
                isDraft: true,
                isDuplicate: true,
            });
            render(JSX);
            expect(screen.getByText("schema form")).toBeInTheDocument();
            expect(mockGetTeamDataset).not.toHaveBeenCalled();
        });
    });
});
