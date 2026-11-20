import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { ShareToken } from "@/interfaces/Collab";
import apis from "@/config/apis";
import { render } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import ShareTokensManager from "./ShareTokensManager";

const writeText = jest.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
    clipboard: { writeText },
});

// notistack's enqueueSnackbar is only wired up by a <SnackbarProvider>,
// which isn't part of the test render tree - stub it out so notification
// calls triggered by create/copy/revoke don't blow up the test.
jest.mock("notistack", () => ({
    enqueueSnackbar: jest.fn(),
    closeSnackbar: jest.fn(),
}));

const baseUrl = `${apis.teamsV2Url}/1/datasets/share-tokens`;

const mockToken: ShareToken = {
    id: 1,
    team_id: 1,
    dataset_id: 42,
    created_by: 1,
    token: "abc123",
    expires_at: "2026-02-01T00:00:00Z",
    revoked_at: null,
    last_submitted_at: null,
    ready_for_review_at: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    status: "active",
};

const renderManager = (
    permissions: { [key: string]: boolean } = {
        "datasets.create": true,
        "datasets.delete": true,
    },
    canCreateLinks = true
) =>
    render(
        <ShareTokensManager
            permissions={permissions}
            teamId="1"
            canCreateLinks={canCreateLinks}
        />
    );

describe("ShareTokensManager", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the existing share links for the team", async () => {
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [mockToken] }))
            )
        );

        renderManager();

        await waitFor(() => {
            expect(screen.getByTestId("share-token-row")).toBeInTheDocument();
        });

        expect(screen.getByText("Draft dataset ID: 42")).toBeInTheDocument();
    });

    it("renders an empty state when there are no share links", async () => {
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [] }))
            )
        );

        renderManager();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "No collaboration links have been created for this team yet."
                )
            ).toBeInTheDocument();
        });
    });

    // Regression (review): a double click created two live links, each with
    // its own draft dataset.
    it("creates only one link when create is clicked twice quickly", async () => {
        let posts = 0;
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [] }))
            ),
            rest.post(baseUrl, (req, res, ctx) => {
                posts += 1;
                return res(
                    ctx.delay(50),
                    ctx.status(201),
                    ctx.json({ data: mockToken })
                );
            })
        );

        renderManager();

        const button = await screen.findByTestId("btn-create-share-token");
        fireEvent.click(button);
        fireEvent.click(button);

        await waitFor(() => expect(button).not.toBeDisabled());
        expect(posts).toBe(1);
    });

    it("creates a new share token and refreshes the list", async () => {
        let listCallCount = 0;
        server.use(
            rest.get(baseUrl, (req, res, ctx) => {
                listCallCount += 1;
                const data = listCallCount === 1 ? [] : [mockToken];
                return res(ctx.status(200), ctx.json({ data }));
            }),
            rest.post(baseUrl, (req, res, ctx) =>
                res(ctx.status(201), ctx.json({ data: mockToken }))
            )
        );

        renderManager();

        await waitFor(() => {
            expect(
                screen.getByTestId("btn-create-share-token")
            ).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId("btn-create-share-token"));

        await waitFor(() => {
            expect(screen.getByTestId("share-token-row")).toBeInTheDocument();
        });
    });

    it("copies the share link to the clipboard", async () => {
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [mockToken] }))
            )
        );

        renderManager();

        const copyButton = await screen.findByRole("button", {
            name: /copy link/i,
        });
        fireEvent.click(copyButton);

        await waitFor(() => {
            expect(writeText).toHaveBeenCalledWith(
                expect.stringContaining("/collab/abc123")
            );
        });
    });

    // A link opens the schema-driven form, so while that form is off the API
    // won't mint links - but existing ones must stay listable and revocable.
    it("hides create, but keeps revoke, while new links can't be created", async () => {
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [mockToken] }))
            )
        );

        renderManager(undefined, false);

        await screen.findByTestId("share-token-row");

        expect(
            screen.queryByTestId("btn-create-share-token")
        ).not.toBeInTheDocument();
        expect(
            screen.getByTestId("btn-revoke-share-token")
        ).toBeInTheDocument();
    });

    // A ready link is still "active" server-side, so the summary has to move
    // it out of the "awaiting collaborator" count rather than count it twice.
    it("counts a link marked ready only as ready for review", async () => {
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(
                    ctx.status(200),
                    ctx.json({
                        data: [
                            {
                                ...mockToken,
                                ready_for_review_at: "2026-01-02T00:00:00Z",
                            },
                        ],
                    })
                )
            )
        );

        renderManager();

        expect(
            await screen.findByText("1 ready for review")
        ).toBeInTheDocument();
        expect(
            screen.queryByText("1 awaiting collaborator")
        ).not.toBeInTheDocument();
        expect(screen.getAllByText("Ready for review").length).toBeGreaterThan(
            0
        );
    });

    it("does not show the revoke action without delete permission", async () => {
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [mockToken] }))
            )
        );

        renderManager({ "datasets.create": true, "datasets.delete": false });

        await screen.findByTestId("share-token-row");

        expect(
            screen.queryByTestId("btn-revoke-share-token")
        ).not.toBeInTheDocument();
    });

    // Regression test: the draft dataset ID used to be plain, unclickable
    // text - a team admin reviewing a submitted draft had no way to jump
    // straight to it from this page, and had to go find it again in the
    // team's full dataset list.
    it("links the draft dataset ID straight to that dataset's edit page", async () => {
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [mockToken] }))
            )
        );

        renderManager();

        const link = await screen.findByTestId("dataset-edit-link");
        expect(link).toHaveAttribute("href", "/account/team/1/datasets/42");
    });

    // Regression test: once a draft goes live, DatasetShareToken's derived
    // `status` flips to "completed" (see getStatusAttribute() on the
    // backend) - this must read as "Completed", not the generic "Revoked"
    // label a plain revoked_at check would otherwise show, since the token
    // being closed for a completed draft is a very different situation
    // from an admin manually killing an open link.
    it("labels a completed draft's token as Completed, not Revoked", async () => {
        const completedToken: ShareToken = {
            ...mockToken,
            revoked_at: "2026-01-05T00:00:00Z",
            status: "completed",
        };
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [completedToken] }))
            )
        );

        renderManager();

        await screen.findByTestId("share-token-row");

        expect(screen.getByText("Completed")).toBeInTheDocument();
        expect(screen.queryByText("Revoked")).not.toBeInTheDocument();
    });

    it("labels a manually revoked (still-open draft) token as Revoked", async () => {
        const revokedToken: ShareToken = {
            ...mockToken,
            revoked_at: "2026-01-05T00:00:00Z",
            status: "revoked",
        };
        server.use(
            rest.get(baseUrl, (req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [revokedToken] }))
            )
        );

        renderManager();

        await screen.findByTestId("share-token-row");

        expect(screen.getByText("Revoked")).toBeInTheDocument();
    });
});
