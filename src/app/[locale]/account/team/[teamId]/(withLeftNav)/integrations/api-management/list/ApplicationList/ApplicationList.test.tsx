import { rest } from "msw";
import mockRouter from "next-router-mock";
import apis from "@/config/apis";
import { render, screen, waitFor } from "@/utils/testUtils";
import { applicationV1, generateApplicationV1 } from "@/mocks/data/application";
import { getApplicationsV1 } from "@/mocks/handlers/application";
import { server } from "@/mocks/server";
import ApplicationList from "./ApplicationList";

const teamId = applicationV1.team_id.toString();

describe("ApplicationList status tabs", () => {
    window.scrollTo = jest.fn();

    const renderWithTab = (tab?: string) => {
        const requestedStatuses: (string | null)[] = [];

        server.use(
            rest.get(apis.applicationsV1Url, (req, res, ctx) => {
                requestedStatuses.push(req.url.searchParams.get("status"));
                return res(
                    ctx.status(200),
                    ctx.json({
                        list: [],
                        lastPage: 1,
                        total: 0,
                        from: 0,
                        to: 0,
                        currentPage: 1,
                    })
                );
            })
        );

        mockRouter.query = tab ? { teamId, tab } : { teamId };
        render(<ApplicationList />);

        return requestedStatuses;
    };

    it("renders a tab per status, linking to the tab query param", async () => {
        renderWithTab();

        const tabs = await screen.findAllByRole("tab");
        expect(tabs.map(tab => tab.textContent)).toEqual([
            "All",
            "Enabled",
            "Disabled",
        ]);
        expect(tabs[1]).toHaveAttribute(
            "href",
            expect.stringContaining("enabled")
        );
    });

    it("requests no status filter on the All tab", async () => {
        const requestedStatuses = renderWithTab();

        await waitFor(() => {
            expect(requestedStatuses).toContain("");
        });
        expect(requestedStatuses).not.toContain("1");
    });

    it.each([
        ["enabled", "1"],
        ["disabled", "0"],
    ])("requests status %s as %s", async (tab, status) => {
        const requestedStatuses = renderWithTab(tab);

        await waitFor(() => {
            expect(requestedStatuses).toContain(status);
        });
    });
});

describe("ApplicationList", () => {
    mockRouter.query = { teamId };
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

    it("should render list", async () => {
        await waitFor(() => {
            expect(screen.getByText(data[0].name)).toBeInTheDocument();
            expect(screen.getByText(data[1].name)).toBeInTheDocument();
            expect(screen.getByText(data[2].name)).toBeInTheDocument();
            expect(
                screen.getByText(`Custom Integration ID: ${data[0].app_id}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`Custom Integration ID: ${data[1].app_id}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`Custom Integration ID: ${data[2].app_id}`)
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
