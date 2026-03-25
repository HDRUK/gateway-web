import useGet from "@/hooks/useGet";
import { act, fireEvent, render, screen } from "@/utils/testUtils";
import FeaturedMetric from ".";

jest.mock("@/hooks/useGet");

const mockMetrics = {
    datasets: 1235,
    custodians: 108,
    durs: 476,
    datasetCohortRequest: 107,
    tools: 350,
    publications: 3322,
    collections: 54,
};

beforeEach(() => {
    (useGet as jest.Mock).mockReturnValue({
        data: mockMetrics,
        isLoading: false,
        mutate: jest.fn(),
    });
});

describe("FeaturedMetric", () => {
    it("renders nothing when stats data is unavailable", () => {
        (useGet as jest.Mock).mockReturnValue({ data: undefined });

        const { container } = render(<FeaturedMetric />);

        expect(container.firstChild).toBeNull();
    });

    it("renders the stat text when data is available", () => {
        render(<FeaturedMetric />);

        expect(screen.getByTestId("stat-line-text")).toBeInTheDocument();
    });

    it("pauses rotation on mouse enter and resumes on mouse leave", () => {
        jest.useFakeTimers();

        const { container } = render(<FeaturedMetric />);

        const wrapper = container.firstChild as HTMLElement;
        const initialText = screen.getByTestId("stat-line-text").textContent;

        fireEvent.mouseEnter(wrapper);

        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(screen.getByTestId("stat-line-text").textContent).toBe(
            initialText
        );

        fireEvent.mouseLeave(wrapper);
    });

    it("rotates to the next stat after 10 seconds", () => {
        jest.useFakeTimers();

        render(<FeaturedMetric />);

        const initialText = screen.getByTestId("stat-line-text").textContent;

        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(screen.getByTestId("stat-line-text").textContent).not.toBe(
            initialText
        );
    });
});
