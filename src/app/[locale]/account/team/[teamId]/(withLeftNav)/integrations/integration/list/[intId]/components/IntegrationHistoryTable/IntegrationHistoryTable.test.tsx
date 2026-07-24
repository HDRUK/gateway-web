import { rest } from "msw";
import mockRouter from "next-router-mock";
import { IntegrationHistory } from "@/interfaces/IntegrationHistory";
import { render, screen, waitFor, fireEvent, within } from "@/utils/testUtils";
import { integrationV1 } from "@/mocks/data/integration";
import { teamV1 } from "@/mocks/data/team";
import { getFederationHistoryV1 } from "@/mocks/handlers/integration";
import { server } from "@/mocks/server";
import apis from "@/config/apis";
import { formatDate } from "@/utils/date";
import IntegrationHistoryTable from "./IntegrationHistoryTable";

const getSidebar = () => screen.getByTestId("integration-history-detail");
const dt = (date: string) => formatDate(date, "DD MMM YYYY HH:mm") as string;

describe("IntegrationHistoryTable", () => {
    mockRouter.query = {
        teamId: teamV1.id.toString(),
        intId: integrationV1.id.toString(),
    };

    it("renders a success row without a message or failed dataset details", async () => {
        const successRow: IntegrationHistory = {
            job_uuid: "1",
            started_at: "2026-07-24 08:18:34",
            finished_at: "2026-07-24 08:18:34",
            status: "success",
            message: null,
            failed_datasets: [],
        };
        server.use(
            getFederationHistoryV1({
                data: [successRow],
                pagination: { lastPage: 1, total: 1, from: 1, to: 1, currentPage: 1 },
            })
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(screen.getByTestId("CheckCircleIcon")).toBeInTheDocument();
        });
        expect(screen.queryByTestId("CancelIcon")).not.toBeInTheDocument();
    });

    it("renders a failed row with its message and each failed dataset", async () => {
        const failedRow: IntegrationHistory = {
            job_uuid: "",
            started_at: "2026-07-24 08:42:59",
            finished_at: "2026-07-24 08:42:59",
            status: "failed",
            message: "GWDM/2.0: must have required property 'gatewayId'",
            failed_datasets: [
                {
                    pid: "mock-dataset-bad",
                    message: "GWDM/2.0: must have required property 'gatewayId'",
                },
            ],
        };
        server.use(
            getFederationHistoryV1({
                data: [failedRow],
                pagination: { lastPage: 1, total: 1, from: 1, to: 1, currentPage: 1 },
            })
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(screen.getByTestId("CancelIcon")).toBeInTheDocument();
        });
        expect(
            screen.getByText("GWDM/2.0: must have required property 'gatewayId'")
        ).toBeInTheDocument();
        expect(screen.getByText(/mock-dataset-bad/)).toBeInTheDocument();
    });

    it("renders an empty state when there is no history", async () => {
        server.use(
            getFederationHistoryV1({
                data: [],
                pagination: { lastPage: 1, total: 0, from: 0, to: 0, currentPage: 1 },
            })
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(
                screen.getByText(/no history found for this integration/i)
            ).toBeInTheDocument();
        });
    });

    it("requests the next page when pagination is clicked", async () => {
        const pageOneRow: IntegrationHistory = {
            job_uuid: "1",
            started_at: "2026-07-24 08:18:34",
            finished_at: "2026-07-24 08:19:00",
            status: "success",
            message: null,
            failed_datasets: [],
        };
        const pageTwoRow: IntegrationHistory = {
            job_uuid: "2",
            started_at: "2026-07-23 08:18:34",
            finished_at: "2026-07-23 08:19:00",
            status: "success",
            message: null,
            failed_datasets: [],
        };

        server.use(
            rest.get(
                `${apis.teamsV1Url}/${teamV1.id}/federations/${integrationV1.id}/history`,
                (req, res, ctx) => {
                    const page = req.url.searchParams.get("page") || "1";
                    const list = page === "2" ? [pageTwoRow] : [pageOneRow];
                    return res(
                        ctx.status(200),
                        ctx.json({
                            list,
                            lastPage: 2,
                            total: 2,
                            from: 1,
                            to: 1,
                            currentPage: Number(page),
                        })
                    );
                }
            )
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(screen.getByText(dt(pageOneRow.started_at))).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /go to page 2/i }));

        await waitFor(() => {
            expect(screen.getByText(dt(pageTwoRow.started_at))).toBeInTheDocument();
        });
        expect(
            screen.queryByText(dt(pageOneRow.started_at))
        ).not.toBeInTheDocument();
    });

    it("shows a placeholder in the sidebar before any execution is selected", async () => {
        const successRow: IntegrationHistory = {
            job_uuid: "77",
            started_at: "2026-07-24 08:18:34",
            finished_at: "2026-07-24 08:19:00",
            status: "success",
            message: null,
            failed_datasets: [],
        };
        server.use(
            getFederationHistoryV1({
                data: [successRow],
                pagination: { lastPage: 1, total: 1, from: 1, to: 1, currentPage: 1 },
            })
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(screen.getByText(dt(successRow.started_at))).toBeInTheDocument();
        });
        expect(
            within(getSidebar()).getByText(/select an execution to view details/i)
        ).toBeInTheDocument();
    });

    it("shows a success execution's details in the sidebar when its row is clicked", async () => {
        const successRow: IntegrationHistory = {
            job_uuid: "77",
            started_at: "2026-07-24 08:18:34",
            finished_at: "2026-07-24 08:19:00",
            status: "success",
            message: null,
            failed_datasets: [],
        };
        server.use(
            getFederationHistoryV1({
                data: [successRow],
                pagination: { lastPage: 1, total: 1, from: 1, to: 1, currentPage: 1 },
            })
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(screen.getByText(dt(successRow.started_at))).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(dt(successRow.started_at)));

        const sidebar = within(getSidebar());
        expect(sidebar.getByText(dt(successRow.started_at))).toBeInTheDocument();
        expect(sidebar.getByText(/complete/i)).toBeInTheDocument();
        expect(sidebar.queryByText(/failed datasets/i)).not.toBeInTheDocument();
    });

    it("shows a failed execution's message and failed datasets in the sidebar when clicked", async () => {
        const failedRow: IntegrationHistory = {
            job_uuid: "",
            started_at: "2026-07-24 08:42:59",
            finished_at: "2026-07-24 08:43:00",
            status: "failed",
            message: "GWDM/2.0: must have required property 'gatewayId'",
            failed_datasets: [
                {
                    pid: "mock-dataset-bad",
                    message: "GWDM/2.0: must have required property 'gatewayId'",
                },
            ],
        };
        server.use(
            getFederationHistoryV1({
                data: [failedRow],
                pagination: { lastPage: 1, total: 1, from: 1, to: 1, currentPage: 1 },
            })
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(screen.getByText(dt(failedRow.started_at))).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(dt(failedRow.started_at)));

        const sidebar = within(getSidebar());
        expect(sidebar.getByText(dt(failedRow.started_at))).toBeInTheDocument();
        expect(sidebar.getByText("Failed")).toBeInTheDocument();
        expect(sidebar.getByText(failedRow.message as string)).toBeInTheDocument();
        expect(sidebar.getByText(/failed datasets/i)).toBeInTheDocument();
        expect(sidebar.getByText(/mock-dataset-bad/)).toBeInTheDocument();
    });

    it("swaps the sidebar content when a different row is clicked", async () => {
        const successRow: IntegrationHistory = {
            job_uuid: "1",
            started_at: "2026-07-24 08:18:34",
            finished_at: "2026-07-24 08:19:00",
            status: "success",
            message: null,
            failed_datasets: [],
        };
        const failedRow: IntegrationHistory = {
            job_uuid: "2",
            started_at: "2026-07-24 08:42:59",
            finished_at: "2026-07-24 08:43:00",
            status: "failed",
            message: "GWDM/2.0: must have required property 'gatewayId'",
            failed_datasets: [],
        };
        server.use(
            getFederationHistoryV1({
                data: [successRow, failedRow],
                pagination: { lastPage: 1, total: 2, from: 1, to: 2, currentPage: 1 },
            })
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(screen.getByText(dt(successRow.started_at))).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(dt(successRow.started_at)));
        expect(
            within(getSidebar()).getByText(dt(successRow.started_at))
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText(dt(failedRow.started_at)));
        const sidebar = within(getSidebar());
        expect(sidebar.getByText(dt(failedRow.started_at))).toBeInTheDocument();
        expect(sidebar.queryByText(dt(successRow.started_at))).not.toBeInTheDocument();
    });

    it("resets the sidebar to the placeholder when the page changes", async () => {
        const pageOneRow: IntegrationHistory = {
            job_uuid: "1",
            started_at: "2026-07-24 08:18:34",
            finished_at: "2026-07-24 08:19:00",
            status: "success",
            message: null,
            failed_datasets: [],
        };
        const pageTwoRow: IntegrationHistory = {
            job_uuid: "2",
            started_at: "2026-07-24 08:18:34",
            finished_at: "2026-07-24 08:19:00",
            status: "success",
            message: null,
            failed_datasets: [],
        };

        server.use(
            rest.get(
                `${apis.teamsV1Url}/${teamV1.id}/federations/${integrationV1.id}/history`,
                (req, res, ctx) => {
                    const page = req.url.searchParams.get("page") || "1";
                    const list = page === "2" ? [pageTwoRow] : [pageOneRow];
                    return res(
                        ctx.status(200),
                        ctx.json({
                            list,
                            lastPage: 2,
                            total: 2,
                            from: 1,
                            to: 1,
                            currentPage: Number(page),
                        })
                    );
                }
            )
        );

        render(<IntegrationHistoryTable />);

        await waitFor(() => {
            expect(screen.getByText(dt(pageOneRow.started_at))).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(dt(pageOneRow.started_at)));
        expect(
            within(getSidebar()).getByText(dt(pageOneRow.started_at))
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /go to page 2/i }));

        await waitFor(() => {
            expect(screen.getByText(dt(pageTwoRow.started_at))).toBeInTheDocument();
        });
        expect(
            within(getSidebar()).getByText(/select an execution to view details/i)
        ).toBeInTheDocument();
    });
});
