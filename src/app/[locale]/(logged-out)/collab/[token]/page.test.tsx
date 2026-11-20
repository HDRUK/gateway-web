import { render, screen } from "@/utils/testUtils";
import CollabPage from "./page";

const enFile = jest.requireActual("@/config/messages/en.json");
jest.mock("next-intl/server", () => ({
    getTranslations: (namespace: string) => (key: string) =>
        `${namespace}.${key}`
            .split(".")
            .reduce(
                (node: Record<string, unknown>, part) =>
                    node[part] as Record<string, unknown>,
                enFile
            ),
}));

const mockCollabEnabled = jest.fn();
const mockSchemaFormEnabled = jest.fn();
const mockSelectorEnabled = jest.fn();
jest.mock("@/flags", () => ({
    isCollaborativeMetadataOnboardingEnabled: () => mockCollabEnabled(),
    isSchemaOnboardingFormEnabled: () => mockSchemaFormEnabled(),
    isSchemaOnboardingFormSelectorEnabled: () => mockSelectorEnabled(),
}));

const mockGetCollabDraft = jest.fn();
jest.mock("@/utils/api", () => ({
    getCollabDraft: (...args: unknown[]) => mockGetCollabDraft(...args),
}));

const mockSchemaDatasetForm = jest.fn();
jest.mock(
    "@/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/_schema/components/SchemaDatasetForm",
    () => ({
        __esModule: true,
        default: (props: Record<string, unknown>) => {
            mockSchemaDatasetForm(props);
            return <div>schema form</div>;
        },
    })
);

jest.mock("@/templates/metadata/form/registry", () => ({
    getFormTemplate: () => ({ Template: () => null, meta: {} }),
    formTemplateMeta: () => ({ description: "template" }),
}));

const TOKEN = "d".repeat(64);

const draft = {
    dataset_id: 42,
    team_id: 7,
    team_contact_point: "team@example.com",
    team_name: "Example Team",
    expires_at: "2026-12-11T00:00:00Z",
    ready_for_review_at: null,
    form: {
        model: "HDRUK",
        version: "4.1.0",
        schemas: [{ model: "HDRUK", version: "4.1.0" }],
        default: { model: "HDRUK", version: "4.1.0" },
        schema: { type: "object" },
        defaultValues: { summary: { contactPoint: "team@example.com" } },
        metadata: { summary: { title: "Untitled draft" } },
    },
};

const renderPage = async (
    token = TOKEN,
    searchParams: Record<string, string> = {}
) =>
    render(
        await CollabPage({
            params: Promise.resolve({ token }),
            searchParams: Promise.resolve(searchParams),
        })
    );

const formProps = () => mockSchemaDatasetForm.mock.calls[0][0];

describe("CollabPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCollabEnabled.mockResolvedValue(true);
        mockSchemaFormEnabled.mockResolvedValue(true);
        mockSelectorEnabled.mockResolvedValue(false);
        mockGetCollabDraft.mockResolvedValue(draft);
    });

    it("opens the draft in the schema form in collab mode", async () => {
        await renderPage();

        expect(screen.getByText("schema form")).toBeInTheDocument();
        expect(formProps()).toEqual(
            expect.objectContaining({
                teamId: "7",
                datasetId: "42",
                isEditing: true,
                isDraft: true,
                canChangeSchema: false,
                defaultTeam: { value: 7, label: "Example Team" },
                collab: { token: TOKEN, readyForReviewAt: null },
                values: {
                    summary: {
                        contactPoint: "team@example.com",
                        title: "Untitled draft",
                    },
                },
            })
        );
    });

    it("never hands the hydrated metadata or defaults to the client form", async () => {
        await renderPage();

        expect(formProps().form).not.toHaveProperty("metadata");
        expect(formProps().form).not.toHaveProperty("defaultValues");
    });

    describe("shows the same invalid-link message, without revealing why", () => {
        const expectInvalid = () =>
            expect(
                screen.getByText("This link is no longer valid")
            ).toBeInTheDocument();

        it("when collaborative onboarding is off", async () => {
            mockCollabEnabled.mockResolvedValue(false);
            await renderPage();

            expectInvalid();
            expect(mockGetCollabDraft).not.toHaveBeenCalled();
        });

        it("when the schema-driven form is off", async () => {
            mockSchemaFormEnabled.mockResolvedValue(false);
            await renderPage();

            expectInvalid();
            expect(mockGetCollabDraft).not.toHaveBeenCalled();
        });

        it("when the token is malformed", async () => {
            await renderPage("not-a-token");

            expectInvalid();
            expect(mockGetCollabDraft).not.toHaveBeenCalled();
        });

        it("when the link is unknown, expired or revoked", async () => {
            mockGetCollabDraft.mockResolvedValue(undefined);
            await renderPage();

            expectInvalid();
            expect(mockSchemaDatasetForm).not.toHaveBeenCalled();
        });
    });

    describe("schema picker", () => {
        it("ignores schema query parameters while the selector is off", async () => {
            await renderPage(TOKEN, { schema: "PRUK", version: "1.0.0" });

            expect(mockGetCollabDraft).toHaveBeenCalledWith(TOKEN, {});
        });

        it("opens the chosen schema when the selector is on", async () => {
            mockSelectorEnabled.mockResolvedValue(true);
            await renderPage(TOKEN, { schema: "PRUK", version: "1.0.0" });

            expect(mockGetCollabDraft).toHaveBeenCalledWith(TOKEN, {
                model: "PRUK",
                version: "1.0.0",
            });
            expect(formProps().canChangeSchema).toBe(true);
        });

        it("falls back to the default schema when the chosen one can't be opened", async () => {
            mockSelectorEnabled.mockResolvedValue(true);
            mockGetCollabDraft
                .mockResolvedValueOnce(undefined)
                .mockResolvedValueOnce(draft);

            await renderPage(TOKEN, { schema: "NOPE", version: "9.9.9" });

            expect(mockGetCollabDraft).toHaveBeenLastCalledWith(TOKEN, {});
            expect(screen.getByText("schema form")).toBeInTheDocument();
        });
    });
});
