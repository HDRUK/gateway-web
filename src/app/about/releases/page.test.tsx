import { render, screen, waitFor } from "@/utils/testUtils";
import ReleasePage from "./page";

jest.mock("next/navigation", () => ({
    useSearchParams() {
        return {
            get: () => "2023",
        };
    },
}));

describe("Releases", () => {
    it("should render contents", async () => {
        const Result = await ReleasePage();
        render(Result);

        await waitFor(() => {
            expect(screen.getByText("mock title 1")).toBeInTheDocument();
            expect(screen.queryByText("mock title 2")).not.toBeInTheDocument();
            expect(screen.getByText("mock title 3")).toBeInTheDocument();
        });
    });
});
