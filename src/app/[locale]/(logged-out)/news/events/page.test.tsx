import mockRouter from "next-router-mock";
import { act, render, screen, waitFor } from "@/utils/testUtils";
import { eventsV1, newsV1 } from "@/mocks/data/cms";
import NewsEventsPage from "./page";

jest.mock("@/utils/cms", () => ({
    ...jest.requireActual("@/utils/cms"),
    getEvents: async () => eventsV1.posts.edges,
    getNews: async () => newsV1.posts.edges,
}));

jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

describe("NewsEvents", () => {
    it("renders the news content", async () => {
        const Result = await NewsEventsPage();

        render(Result);

        await waitFor(() => {
            expect(
                screen.getByText(newsV1.posts.edges[0].node.newsFields.headline)
            ).toBeInTheDocument();
            expect(
                screen.queryByText(
                    eventsV1.posts.edges[0].node.newsFields.headline
                )
            ).not.toBeInTheDocument();
        });
    });

    it("renders a no results message", async () => {
        const Result = await NewsEventsPage();

        render(Result);

        act(() => {
            mockRouter.setCurrentUrl("/news_events?tab=news&year=2025");
        });

        await waitFor(() => {
            expect(
                screen.getByText("There are no results for the selected year.")
            ).toBeInTheDocument();
        });
    });

    it("renders the events content", async () => {
        const Result = await NewsEventsPage();

        render(Result);

        act(() => {
            mockRouter.setCurrentUrl("/news_events?tab=events");
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    eventsV1.posts.edges[0].node.newsFields.headline
                )
            ).toBeInTheDocument();
            expect(
                screen.queryByText(
                    newsV1.posts.edges[0].node.newsFields.headline
                )
            ).not.toBeInTheDocument();
        });
    });
});
