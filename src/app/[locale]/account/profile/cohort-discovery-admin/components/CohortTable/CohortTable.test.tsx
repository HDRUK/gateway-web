import { formatDate } from "@/utils/date";
import { render, screen, waitFor } from "@/utils/testUtils";
import { generateCohortRequestV1 } from "@/mocks/data/cohortRequest";
import { getCohortRequestsV1 } from "@/mocks/handlers/cohortRequest";
import { server } from "@/mocks/server";
import CohortTable from "./CohortTable";

const requests = [
    generateCohortRequestV1({ request_status: "APPROVED" }),
    generateCohortRequestV1({ request_status: "REJECTED" }),
    generateCohortRequestV1({ request_status: "PENDING" }),
    generateCohortRequestV1({ request_status: "BANNED" }),
    generateCohortRequestV1({ request_status: "SUSPENDED" }),
    generateCohortRequestV1({ request_status: "EXPIRED" }),
];

describe("CohortTable", () => {
    it("should render row headers", async () => {
        server.use(getCohortRequestsV1(requests));
        render(<CohortTable />);

        await waitFor(
            () => {
                expect(
                    screen.getByText(requests[0].user.name)
                ).toBeInTheDocument();
            },
            { timeout: 300 }
        ); // speed up

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Organisation")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Date requested")).toBeInTheDocument();
        expect(screen.getByText("Date Actioned")).toBeInTheDocument();
    });

    it("should render row content", async () => {
        server.use(getCohortRequestsV1(requests));
        render(<CohortTable />);

        await waitFor(
            () => {
                const rows = screen.getAllByRole("row");
                expect(rows.length).toBeGreaterThanOrEqual(7); // header + 6 rows

                const firstRow = rows[1];
                const req = requests[0];

                expect(firstRow).toHaveTextContent(req.user.name);
                expect(firstRow).toHaveTextContent(req.user.email);
                expect(firstRow).toHaveTextContent(req.user.organisation);
                expect(firstRow).toHaveTextContent(
                    formatDate(req.created_at, "DD/MM/YYYY")
                );
                expect(firstRow).toHaveTextContent(
                    formatDate(req.updated_at, "DD/MM/YYYY")
                );
                expect(firstRow).toHaveTextContent("Approved");

                const statuses = [
                    "Rejected",
                    "Pending",
                    "Banned",
                    "Suspended",
                    "Expired",
                ];
                statuses.forEach((status, index) => {
                    expect(rows[index + 2]).toHaveTextContent(status); // rows[2] to rows[6]
                });
            },
            { timeout: 300 }
        ); // faster wait
    });
});
