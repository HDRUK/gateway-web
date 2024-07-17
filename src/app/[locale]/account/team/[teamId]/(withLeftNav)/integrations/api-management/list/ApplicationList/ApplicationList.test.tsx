import mockRouter from "next-router-mock";
import { render, screen, waitFor } from "@/utils/testUtils";
import { applicationV1, generateApplicationV1 } from "@/mocks/data/application";
import { getApplicationsV1 } from "@/mocks/handlers/application";
import { server } from "@/mocks/server";
import ApplicationList from "./ApplicationList";

describe("ApplicationList", () => {
    mockRouter.query = { teamId: applicationV1.team_id.toString() };
    const data = Array.from({ length: 3 }).map(() => generateApplicationV1());
    window.scrollTo = jest.fn();

    beforeEach(() => {
        server.use(
            getApplicationsV1({
                data,
                pagination: {
                    lastPage: 2,
                    total: 3,
                    from: 0,
                    to: 3,
                    currentPage: 1,
                },
            })
        );

        render(<ApplicationList />);
    });

    it("should render count of apps", async () => {
        await waitFor(() => {
            expect(screen.getByTestId("number-of-apps").textContent).toBe(
                "Number of Apps: 3"
            );
        });
    });

    it("should render list", async () => {
        await waitFor(() => {
            expect(screen.getByText(data[0].name)).toBeInTheDocument();
            expect(screen.getByText(data[1].name)).toBeInTheDocument();
            expect(screen.getByText(data[2].name)).toBeInTheDocument();
            expect(
                screen.getByText(`Private App ID: ${data[0].app_id}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`Private App ID: ${data[1].app_id}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`Private App ID: ${data[2].app_id}`)
            ).toBeInTheDocument();
        });
    });
    it("should render pagination", async () => {
        await waitFor(() => {
            const paginationItems = screen.getAllByTestId("pagination-item");
            expect(paginationItems[1].textContent).toBe("1");
            expect(paginationItems[2].textContent).toBe("2");
            expect(paginationItems).toHaveLength(4);

            expect(screen.getByTestId("ArrowLeftIcon")).toBeInTheDocument();
            expect(screen.getByTestId("ArrowRightIcon")).toBeInTheDocument();
        });
    });
});
