import { render, screen, waitFor } from "@/utils/testUtils";
import { releaseV1 } from "@/mocks/data/cms";
import ReleasePage from "./page";

describe("Releases", () => {
    it("should render contents", async () => {
        const Result = await ReleasePage();

        render(Result);

        await waitFor(() => {
            expect(
                screen.getByText(releaseV1.posts.edges[0].node.title)
            ).toBeInTheDocument();
            expect(
                screen.queryByText(releaseV1.posts.edges[1].node.title)
            ).not.toBeInTheDocument();
            expect(
                screen.getByText(releaseV1.posts.edges[2].node.title)
            ).toBeInTheDocument();
        });
    });
});
