import {
    PROGRESS_END_EVENT,
    PROGRESS_START_EVENT,
    ROUTER_PROGRESS_SOURCE,
} from "@/consts/navigation";
import { act, render, screen } from "@/utils/testUtils";
import NavigationProgress from "./NavigationProgress";

const dispatch = (type: string, source = ROUTER_PROGRESS_SOURCE) =>
    act(() => {
        window.dispatchEvent(new CustomEvent(type, { detail: source }));
    });

const advance = (ms: number) =>
    act(() => {
        jest.advanceTimersByTime(ms);
    });

const getProgress = () => screen.getByRole("progressbar", { hidden: true });

describe("NavigationProgress", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        render(<NavigationProgress />);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("shows progress once a navigation has been pending briefly", () => {
        dispatch(PROGRESS_START_EVENT);
        expect(getProgress()).toHaveAttribute("aria-valuenow", "0");

        advance(150);
        expect(getProgress()).toHaveAttribute("aria-valuenow", "30");
    });

    it("completes when the navigation ends", () => {
        dispatch(PROGRESS_START_EVENT);
        advance(150);
        dispatch(PROGRESS_END_EVENT);

        expect(getProgress()).toHaveAttribute("aria-valuenow", "100");
    });

    it("stays hidden for a navigation that ends straight away", () => {
        dispatch(PROGRESS_START_EVENT);
        dispatch(PROGRESS_END_EVENT);
        advance(150);

        expect(getProgress()).toHaveAttribute("aria-valuenow", "0");
    });

    it("ignores an end with nothing pending", () => {
        dispatch(PROGRESS_END_EVENT);
        advance(150);

        expect(getProgress()).toHaveAttribute("aria-valuenow", "0");
    });

    it("waits for every source to end before completing", () => {
        dispatch(PROGRESS_START_EVENT);
        dispatch(PROGRESS_START_EVENT, "search");
        advance(150);
        dispatch(PROGRESS_END_EVENT);

        expect(getProgress()).toHaveAttribute("aria-valuenow", "30");

        dispatch(PROGRESS_END_EVENT, "search");
        expect(getProgress()).toHaveAttribute("aria-valuenow", "100");
    });

    it("completes a navigation that never ends", () => {
        dispatch(PROGRESS_START_EVENT);
        advance(10000);

        expect(getProgress()).toHaveAttribute("aria-valuenow", "100");
    });

    it("keeps waiting on other sources once the router times out", () => {
        dispatch(PROGRESS_START_EVENT);
        dispatch(PROGRESS_START_EVENT, "search");
        advance(10000);

        expect(getProgress()).not.toHaveAttribute("aria-valuenow", "100");

        dispatch(PROGRESS_END_EVENT, "search");
        expect(getProgress()).toHaveAttribute("aria-valuenow", "100");
    });

    it("shows a fresh bar when a navigation begins while the last one finishes", () => {
        dispatch(PROGRESS_START_EVENT);
        advance(150);
        dispatch(PROGRESS_END_EVENT);
        const completed = getProgress();
        dispatch(PROGRESS_START_EVENT);
        advance(150);

        expect(getProgress()).not.toBe(completed);
        expect(getProgress()).toHaveAttribute("aria-valuenow", "30");
    });

    it("keeps its progress when another navigation starts mid-way", () => {
        dispatch(PROGRESS_START_EVENT);
        advance(450);
        dispatch(PROGRESS_START_EVENT);
        advance(150);

        expect(
            Number(getProgress().getAttribute("aria-valuenow"))
        ).toBeGreaterThan(30);
    });
});
