import { render, screen, waitFor, within } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import { getCohortRequestsV1 } from "@/mocks/handlers/cohortRequest";
import { generateCohortRequestV1 } from "@/mocks/data/cohortRequest";
import { formatDate } from "@/utils/date";
import CohortTable from "./CohortTable";

const requests = [
    generateCohortRequestV1({ request_status: "APPROVED" }),
    generateCohortRequestV1({ request_status: "REJECTED" }),
    generateCohortRequestV1({ request_status: "PENDING" }),
    generateCohortRequestV1({ request_status: "BANNED" }),
    generateCohortRequestV1({ request_status: "SUSPENDED" }),
    generateCohortRequestV1({ request_status: "EXPIRED" }),
];

describe("Cohort Table", () => {
    it("should render row headers", async () => {
        server.use(getCohortRequestsV1(requests));
        render(<CohortTable />);

        await waitFor(() => {
            expect(screen.getByText(requests[0].user.name)).toBeInTheDocument();
        });
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Organisation")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Date requested")).toBeInTheDocument();
        expect(screen.getByText("Date Actioned")).toBeInTheDocument();
    });
    it("should render row content", async () => {
        server.use(getCohortRequestsV1(requests));
        const { container } = render(<CohortTable />);

        await waitFor(() => {
            const tableRows = container.querySelectorAll("tr");
            expect(
                within(tableRows[1]).getByText(requests[0].user.name, {
                    exact: false,
                })
            ).toBeInTheDocument();
            expect(
                within(tableRows[1]).getByText(requests[0].user.email)
            ).toBeInTheDocument();
            expect(
                within(tableRows[1]).getByText(requests[0].user.organisation)
            ).toBeInTheDocument();

            expect(
                within(tableRows[1]).getByText(
                    formatDate(requests[0].created_at, "DD/MM/YYYY")
                )
            ).toBeInTheDocument();
            expect(
                within(tableRows[1]).getByText(
                    formatDate(requests[0].updated_at, "DD/MM/YYYY")
                )
            ).toBeInTheDocument();

            expect(
                within(tableRows[1]).getByText("Approved")
            ).toBeInTheDocument();
            expect(
                within(tableRows[2]).getByText("Rejected")
            ).toBeInTheDocument();
            expect(
                within(tableRows[3]).getByText("Pending")
            ).toBeInTheDocument();
            expect(
                within(tableRows[4]).getByText("Banned")
            ).toBeInTheDocument();
            expect(
                within(tableRows[5]).getByText("Suspended")
            ).toBeInTheDocument();
            expect(
                within(tableRows[6]).getByText("Expired")
            ).toBeInTheDocument();
        });
    });
});
