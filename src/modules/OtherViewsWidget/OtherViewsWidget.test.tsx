import { rest } from "msw";
import { render, screen, waitFor } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import apis from "@/config/apis";
import OtherViewsWidget from "./OtherViewsWidget";

const TEAM_ID = "1";
const DATA_CUSTODIAN_VIEWS = 123;

const defaultProps = {
    teamId: TEAM_ID,
    startDate: "2025-06-01",
    endDate: "2026-06-01",
};

const dashboardUrl = `${apis.teamsV3Url}/${TEAM_ID}/dashboard`;

describe("OtherViewsWidget", () => {
    it("falls back to 0 when an endpoint returns no count", async () => {
        server.use(
            rest.get(`${dashboardUrl}/collections/views`, (_req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: [] }))
            ),
            rest.get(`${dashboardUrl}/datacustodians/views`, (_req, res, ctx) =>
                res(
                    ctx.status(200),
                    ctx.json({ data: [{ counter: DATA_CUSTODIAN_VIEWS }] })
                )
            )
        );

        render(<OtherViewsWidget {...defaultProps} />);

        await waitFor(() => {
            expect(
                screen.getByText(DATA_CUSTODIAN_VIEWS.toLocaleString())
            ).toBeInTheDocument();
        });
        expect(screen.getByText("0")).toBeInTheDocument();
    });
});
