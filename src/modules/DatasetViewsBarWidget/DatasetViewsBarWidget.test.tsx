import { rest } from "msw";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import apis from "@/config/apis";
import DatasetViewsBarWidget from "./DatasetViewsBarWidget";

jest.mock("@mui/x-charts/BarChart", () => ({
    BarChart: ({
        series,
        yAxis,
        onItemClick,
    }: {
        series: { data: number[] }[];
        yAxis: { data: string[] }[];
        onItemClick?: (e: unknown, d: { dataIndex: number }) => void;
    }) => (
        <div data-testid="bar-chart">
            {yAxis[0]?.data.map((label: string, i: number) => (
                <button
                    key={label}
                    data-testid={`bar-${i}`}
                    onClick={e => onItemClick?.(e, { dataIndex: i })}>
                    {label}: {series[0]?.data[i]}
                </button>
            ))}
        </div>
    ),
}));

const TEAM_ID = "1";
const START_DATE = "2025-06-01";
const END_DATE = "2026-06-01";

const TOP_DATA = [
    { id: 10, title: "Dataset Alpha", counter: 344 },
    { id: 11, title: "Dataset Beta", counter: 200 },
];

const BOTTOM_DATA = [
    { id: 12, title: "Dataset Gamma", counter: 5 },
    { id: 13, title: "Dataset Delta", counter: 3 },
];

const mockRouter = { push: jest.fn() };

jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: () => mockRouter,
}));

const defaultProps = {
    teamId: TEAM_ID,
    startDate: START_DATE,
    endDate: END_DATE,
};

describe("DatasetViewsBarWidget", () => {
    beforeEach(() => {
        server.use(
            rest.get(
                `${apis.teamsV3Url}/${TEAM_ID}/dashboard/datasets/views/top`,
                (_req, res, ctx) =>
                    res(ctx.status(200), ctx.json({ data: TOP_DATA }))
            ),
            rest.get(
                `${apis.teamsV3Url}/${TEAM_ID}/dashboard/datasets/views/bottom`,
                (_req, res, ctx) =>
                    res(ctx.status(200), ctx.json({ data: BOTTOM_DATA }))
            )
        );
        mockRouter.push.mockClear();
    });

    it("renders most-viewed title and toggle link by default", async () => {
        render(<DatasetViewsBarWidget {...defaultProps} />);

        await waitFor(() => {
            expect(
                screen.getByText("Most Dataset Views")
            ).toBeInTheDocument();
        });

        expect(screen.getByText("Show least views")).toBeInTheDocument();
    });

    it("navigates to dataset page when a bar is clicked", async () => {
        render(<DatasetViewsBarWidget {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("bar-0")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId("bar-0"));
        expect(mockRouter.push).toHaveBeenCalledWith(
            `/dataset/${TOP_DATA[0].id}`
        );
    });

    it("toggles to least-viewed mode when link is clicked", async () => {
        render(<DatasetViewsBarWidget {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText("Show least views")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Show least views"));

        await waitFor(() => {
            expect(
                screen.getByText("Least Dataset Views")
            ).toBeInTheDocument();
        });

        expect(screen.getByText("Show most views")).toBeInTheDocument();
    });
});
