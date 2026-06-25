import { rest } from "msw";
import { render, screen, waitFor } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import apis from "@/config/apis";
import EnquiriesWidget from "./EnquiriesWidget";

const TEAM_ID = "1";
const GENERAL_ENQUIRIES = 12;
const FEASIBILITY_ENQUIRIES = 14;
const DATA_ACCESS_REQUESTS = 16;

const defaultProps = {
    teamId: TEAM_ID,
    startDate: "2025-06-01",
    endDate: "2026-06-01",
};

const dashboardUrl = `${apis.teamsV3Url}/${TEAM_ID}/dashboard`;

const teamHandler = (isQuestionBank: boolean) =>
    rest.get(`${apis.teamsV1Url}/${TEAM_ID}`, (_req, res, ctx) =>
        res(
            ctx.status(200),
            ctx.json({ data: { is_question_bank: isQuestionBank, users: [] } })
        )
    );

describe("EnquiriesWidget", () => {

    it("renders the totals returned for each enquiry type", async () => {
        server.use(
            teamHandler(true),
            rest.get(`${dashboardUrl}/general-enquires/count`, (_req, res, ctx) =>
                res(
                    ctx.status(200),
                    ctx.json({
                        data: { total: GENERAL_ENQUIRIES, total_by_interval: 0 },
                    })
                )
            ),
            rest.get(
                `${dashboardUrl}/fesability-enquires/count`,
                (_req, res, ctx) =>
                    res(
                        ctx.status(200),
                        ctx.json({
                            data: {
                                total: FEASIBILITY_ENQUIRIES,
                                total_by_interval: 0,
                            },
                        })
                    )
            ),
            rest.get(
                `${dashboardUrl}/data-access-requests/count`,
                (_req, res, ctx) =>
                    res(
                        ctx.status(200),
                        ctx.json({
                            data: {
                                total: DATA_ACCESS_REQUESTS,
                                total_by_interval: 0,
                            },
                        })
                    )
            )
        );

        render(<EnquiriesWidget {...defaultProps} />);

        await waitFor(() => {
            expect(
                screen.getByText(GENERAL_ENQUIRIES.toLocaleString())
            ).toBeInTheDocument();
        });
        expect(
            screen.getByText(FEASIBILITY_ENQUIRIES.toLocaleString())
        ).toBeInTheDocument();
        expect(
            screen.getByText(DATA_ACCESS_REQUESTS.toLocaleString())
        ).toBeInTheDocument();
    });

    it("falls back to 0 when an endpoint returns no count", async () => {
        server.use(
            teamHandler(true),
            rest.get(`${dashboardUrl}/general-enquires/count`, (_req, res, ctx) =>
                res(ctx.status(200), ctx.json({ data: { total: null } }))
            ),
            rest.get(
                `${dashboardUrl}/fesability-enquires/count`,
                (_req, res, ctx) =>
                    res(
                        ctx.status(200),
                        ctx.json({
                            data: {
                                total: FEASIBILITY_ENQUIRIES,
                                total_by_interval: 0,
                            },
                        })
                    )
            ),
            rest.get(
                `${dashboardUrl}/data-access-requests/count`,
                (_req, res, ctx) =>
                    res(ctx.status(200), ctx.json({ data: { total: null } }))
            )
        );

        render(<EnquiriesWidget {...defaultProps} />);

        await waitFor(() => {
            expect(
                screen.getByText(FEASIBILITY_ENQUIRIES.toLocaleString())
            ).toBeInTheDocument();
        });
        expect(screen.getAllByText("0")).toHaveLength(2);
    });

    it("hides the Data Access Requests tile when the question bank is disabled", async () => {
        server.use(
            teamHandler(false),
            rest.get(`${dashboardUrl}/general-enquires/count`, (_req, res, ctx) =>
                res(
                    ctx.status(200),
                    ctx.json({
                        data: { total: GENERAL_ENQUIRIES, total_by_interval: 0 },
                    })
                )
            ),
            rest.get(
                `${dashboardUrl}/fesability-enquires/count`,
                (_req, res, ctx) =>
                    res(
                        ctx.status(200),
                        ctx.json({
                            data: {
                                total: FEASIBILITY_ENQUIRIES,
                                total_by_interval: 0,
                            },
                        })
                    )
            )
        );

        render(<EnquiriesWidget {...defaultProps} />);

        await waitFor(() => {
            expect(
                screen.getByText(GENERAL_ENQUIRIES.toLocaleString())
            ).toBeInTheDocument();
        });
        expect(screen.queryByText("Data Access Requests")).not.toBeInTheDocument();
    });
});
