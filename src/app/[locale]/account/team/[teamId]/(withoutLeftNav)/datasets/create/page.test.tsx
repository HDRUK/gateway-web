import { render, screen } from "@/utils/testUtils";
import CreateDatasetPage from "./page";

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

const mockGetFormHydration = jest.fn();
jest.mock("@/utils/api", () => ({
    getUser: jest.fn().mockResolvedValue({ id: 1, roles: [] }),
    getTeam: jest.fn().mockResolvedValue({ users: [] }),
    getSchemaFromTraser: jest.fn().mockResolvedValue({ schema: { $defs: {} } }),
    getFormHydration: () => mockGetFormHydration(),
}));

describe("CreateDatasetPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetFormHydration.mockResolvedValue({ defaultValues: {} });
    });

    describe("SchemaOnboardingForm feature flag", () => {
        it("renders the existing form when the flag is off", async () => {
            mockIsSchemaOnboardingFormEnabled.mockResolvedValueOnce(false);

            const JSX = await CreateDatasetPage({
                params: Promise.resolve({ teamId: "1" }),
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

            const JSX = await CreateDatasetPage({
                params: Promise.resolve({ teamId: "1" }),
                searchParams: Promise.resolve({
                    schema: "PRUK",
                    version: "1.0.0",
                }),
            });

            expect(mockSchemaDatasetFormPage).toHaveBeenCalledWith({
                teamId: "1",
                model: "PRUK",
                version: "1.0.0",
            });
            render(JSX);
            expect(screen.getByText("schema form")).toBeInTheDocument();
            expect(mockGetFormHydration).not.toHaveBeenCalled();
        });
    });
});
