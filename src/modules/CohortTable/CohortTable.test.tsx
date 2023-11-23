import { render, screen, waitFor } from "@/utils/testUtils";
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
        render(<CohortTable />);

        await waitFor(() => {
            expect(screen.getByText(requests[0].user.name)).toBeInTheDocument();
            expect(
                screen.getByText(requests[0].user.email)
            ).toBeInTheDocument();
            expect(
                screen.getByText(requests[0].user.organisation)
            ).toBeInTheDocument();

            expect(screen.getByText("Approved")).toBeInTheDocument();
            expect(screen.getByText("Rejected")).toBeInTheDocument();
            expect(screen.getByText("Pending")).toBeInTheDocument();
            expect(screen.getByText("Banned")).toBeInTheDocument();
            expect(screen.getByText("Suspended")).toBeInTheDocument();
            expect(screen.getByText("Expired")).toBeInTheDocument();

            expect(
                screen.getByText(
                    formatDate(new Date(requests[0].created_at), "dd/MM/yyyy")
                )
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    formatDate(new Date(requests[0].updated_at), "dd/MM/yyyy")
                )
            ).toBeInTheDocument();
        });
    });
});
