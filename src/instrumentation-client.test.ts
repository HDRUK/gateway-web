import {
    PROGRESS_END_EVENT,
    PROGRESS_START_EVENT,
    ROUTER_PROGRESS_SOURCE,
} from "@/consts/navigation";
import { RouteName } from "@/consts/routeName";
import { onRouterTransitionStart } from "./instrumentation-client";

describe("instrumentation-client", () => {
    const listener = jest.fn();

    afterEach(() => {
        listener.mockClear();
        window.removeEventListener(PROGRESS_START_EVENT, listener);
        window.removeEventListener(PROGRESS_END_EVENT, listener);
    });

    it("announces the start of a router transition after the current task", async () => {
        window.addEventListener(PROGRESS_START_EVENT, listener);

        onRouterTransitionStart(`/${RouteName.SEARCH}`);

        expect(listener).not.toHaveBeenCalled();
        await Promise.resolve();
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener.mock.calls[0][0].detail).toBe(ROUTER_PROGRESS_SOURCE);
    });

    it("ignores a transition to another origin", async () => {
        window.addEventListener(PROGRESS_START_EVENT, listener);

        onRouterTransitionStart("https://example.com/download");

        await Promise.resolve();
        expect(listener).not.toHaveBeenCalled();
    });

    it.each(["pushState", "replaceState"] as const)(
        "announces the router ending after %s",
        async method => {
            window.addEventListener(PROGRESS_END_EVENT, listener);

            window.history[method]({}, "", `/${RouteName.SEARCH}`);

            expect(window.location.pathname).toBe(`/${RouteName.SEARCH}`);
            expect(listener).not.toHaveBeenCalled();
            await Promise.resolve();
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener.mock.calls[0][0].detail).toBe(
                ROUTER_PROGRESS_SOURCE
            );
        }
    );
});
