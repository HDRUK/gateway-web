import { JSONSchemaDocument } from "@hdruk/gwdm-view";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import { markCollabReadyAction } from "@/app/actions/markCollabReadyAction";
import { saveCollabDraftAction } from "@/app/actions/saveCollabDraftAction";
import { saveSchemaDatasetAction } from "@/app/actions/saveSchemaDatasetAction";
import SchemaDatasetForm from "./SchemaDatasetForm";

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
    usePathname: () => "/en/collab/token",
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

jest.mock("@/app/actions/saveSchemaDatasetAction", () => ({
    saveSchemaDatasetAction: jest.fn(),
}));
jest.mock("@/app/actions/saveCollabDraftAction", () => ({
    saveCollabDraftAction: jest.fn(),
}));
jest.mock("@/app/actions/markCollabReadyAction", () => ({
    markCollabReadyAction: jest.fn(),
}));
jest.mock("@/services/notification");

const TOKEN = "c".repeat(64);

const schema = {
    type: "object",
    required: ["summary"],
    properties: {
        summary: {
            type: "object",
            required: ["title"],
            properties: { title: { type: "string" } },
        },
    },
} as unknown as JSONSchemaDocument;

const form = {
    model: "HDRUK",
    version: "4.1.0",
    schemas: [{ model: "HDRUK", version: "4.1.0" }],
    default: { model: "HDRUK", version: "4.1.0" },
    schema,
};

const custodianForm = {
    ...form,
    schema: {
        type: "object",
        required: ["summary"],
        properties: {
            summary: {
                type: "object",
                required: ["title", "dataCustodian"],
                properties: {
                    title: { type: "string" },
                    dataCustodian: {
                        type: "object",
                        required: ["contactPoint"],
                        properties: {
                            contactPoint: { type: "string", format: "email" },
                            logo: { type: "string", format: "uri" },
                        },
                    },
                },
            },
        },
    } as unknown as JSONSchemaDocument,
};

const renderForm = ({
    values = { summary: { title: "A dataset" } },
    collab,
    form: formProp = form,
}: {
    values?: Record<string, unknown>;
    collab?: { token: string; readyForReviewAt: string | null };
    form?: typeof form;
} = {}) =>
    render(
        <SchemaDatasetForm
            teamId="7"
            isEditing
            datasetId="42"
            form={formProp}
            values={values}
            meta={{ description: "Test form" }}
            defaultTeam={{ value: 7, label: "Example Team" }}
            isDraft
            collab={collab}>
            <div>template</div>
        </SchemaDatasetForm>
    );

const collab = (readyForReviewAt: string | null = null) => ({
    token: TOKEN,
    readyForReviewAt,
});

describe("SchemaDatasetForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(saveCollabDraftAction).mockResolvedValue({ ok: true });
        jest.mocked(markCollabReadyAction).mockResolvedValue({
            ok: true,
            readyForReviewAt: "2026-11-20T10:00:00Z",
        });
        jest.mocked(saveSchemaDatasetAction).mockResolvedValue({
            ok: true,
            datasetId: 42,
        });
    });

    describe("team mode", () => {
        it("keeps the make active action and the link back to the team", () => {
            renderForm();

            expect(screen.getByTestId("btn-make-active")).toHaveTextContent(
                "Make active"
            );
            expect(
                screen.getByRole("link", { name: /back/i })
            ).toBeInTheDocument();
        });
    });

    describe("team mode", () => {
        it("still requires the custodian the team picks", async () => {
            renderForm({
                form: custodianForm,
                values: {
                    summary: {
                        title: "A dataset",
                        dataCustodian: { contactPoint: null },
                    },
                },
            });

            fireEvent.click(screen.getByTestId("btn-make-active"));

            await waitFor(() =>
                expect(
                    screen.getAllByText(/Make active/).length
                ).toBeGreaterThan(1)
            );
            expect(saveSchemaDatasetAction).not.toHaveBeenCalled();
        });
    });

    describe("collab mode", () => {
        it("offers mark ready for review instead of make active, with no team links", () => {
            renderForm({ collab: collab() });

            expect(screen.getByTestId("btn-make-active")).toHaveTextContent(
                "Mark ready for review"
            );
            expect(
                screen.queryByRole("link", { name: /back/i })
            ).not.toBeInTheDocument();
        });

        it("saves a draft through the share link and stays on the page", async () => {
            renderForm({ collab: collab() });

            fireEvent.click(screen.getByTestId("btn-save-draft"));

            await waitFor(() =>
                expect(saveCollabDraftAction).toHaveBeenCalledWith({
                    token: TOKEN,
                    model: "HDRUK",
                    version: "4.1.0",
                    metadata: { summary: { title: "A dataset" } },
                })
            );
            expect(saveSchemaDatasetAction).not.toHaveBeenCalled();
            expect(mockPush).not.toHaveBeenCalled();
        });

        it("saves the latest values before marking ready, so the team reviews them", async () => {
            renderForm({ collab: collab() });

            fireEvent.click(screen.getByTestId("btn-make-active"));

            await waitFor(() =>
                expect(markCollabReadyAction).toHaveBeenCalledWith(TOKEN, true)
            );
            expect(saveCollabDraftAction).toHaveBeenCalled();
            expect(
                jest.mocked(saveCollabDraftAction).mock.invocationCallOrder[0]
            ).toBeLessThan(
                jest.mocked(markCollabReadyAction).mock.invocationCallOrder[0]
            );
            expect(mockPush).not.toHaveBeenCalled();
            expect(
                await screen.findByTestId("btn-make-active")
            ).toHaveTextContent("Unmark ready for review");
        });

        it("does not mark ready when the save fails", async () => {
            jest.mocked(saveCollabDraftAction).mockResolvedValue({
                ok: false,
                status: 422,
            });
            renderForm({ collab: collab() });

            fireEvent.click(screen.getByTestId("btn-make-active"));

            await waitFor(() =>
                expect(saveCollabDraftAction).toHaveBeenCalled()
            );
            expect(markCollabReadyAction).not.toHaveBeenCalled();
        });

        it("does not mark ready while required fields are missing", async () => {
            renderForm({ values: { summary: {} }, collab: collab() });

            fireEvent.click(screen.getByTestId("btn-make-active"));

            await waitFor(() =>
                expect(
                    screen.getAllByText(/Mark ready for review/).length
                ).toBeGreaterThan(0)
            );
            expect(saveCollabDraftAction).not.toHaveBeenCalled();
            expect(markCollabReadyAction).not.toHaveBeenCalled();
        });

        // Regression: the custodian is hidden from the collaborator and forced
        // by the API on save, so a team without a contact point (or a logo
        // that isn't a URI) used to leave Summary permanently invalid.
        it("can mark ready when only server-owned fields are invalid", async () => {
            renderForm({
                form: custodianForm,
                values: {
                    summary: {
                        title: "A dataset",
                        dataCustodian: { contactPoint: null, logo: "nope" },
                    },
                },
                collab: collab(),
            });

            fireEvent.click(screen.getByTestId("btn-make-active"));

            await waitFor(() =>
                expect(markCollabReadyAction).toHaveBeenCalledWith(TOKEN, true)
            );
        });

        it("lets the collaborator unmark a draft that is already ready", async () => {
            jest.mocked(markCollabReadyAction).mockResolvedValue({
                ok: true,
                readyForReviewAt: null,
            });
            renderForm({ collab: collab("2026-11-19T09:00:00Z") });

            const button = screen.getByTestId("btn-make-active");
            expect(button).toHaveTextContent("Unmark ready for review");
            fireEvent.click(button);

            await waitFor(() =>
                expect(markCollabReadyAction).toHaveBeenCalledWith(TOKEN, false)
            );
            expect(saveCollabDraftAction).not.toHaveBeenCalled();
            expect(
                await screen.findByTestId("btn-make-active")
            ).toHaveTextContent("Mark ready for review");
        });
    });
});
