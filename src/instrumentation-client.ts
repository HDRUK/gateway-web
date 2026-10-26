import {
    PROGRESS_END_EVENT,
    PROGRESS_START_EVENT,
    ROUTER_PROGRESS_SOURCE,
} from "@/consts/navigation";

const dispatchRouterProgress = (type: string) =>
    window.dispatchEvent(
        new CustomEvent(type, { detail: ROUTER_PROGRESS_SOURCE })
    );

const history = window.history as History & { announcesCommits?: boolean };

if (!history.announcesCommits) {
    history.announcesCommits = true;

    (["pushState", "replaceState"] as const).forEach(method => {
        const original = history[method].bind(history);

        history[method] = (...args: Parameters<History["pushState"]>) => {
            original(...args);
            queueMicrotask(() => dispatchRouterProgress(PROGRESS_END_EVENT));
        };
    });
}

export const onRouterTransitionStart = (url: string) => {
    if (new URL(url, window.location.href).origin !== window.location.origin) {
        return;
    }

    queueMicrotask(() => dispatchRouterProgress(PROGRESS_START_EVENT));
};
