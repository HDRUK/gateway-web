import { render, screen } from "@/utils/testUtils";
import LearnMoreWidget from "./LearnMoreWidget";

describe("LearnMoreWidget", () => {
    it("renders the title and embeds the playlist iframe", () => {
        const { container } = render(<LearnMoreWidget />);

        expect(
            screen.getByRole("heading", {
                name: "Learn more about the Gateway",
            })
        ).toBeInTheDocument();

        const iframe = container.querySelector("iframe");
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute(
            "src",
            expect.stringContaining(
                "youtube.com/embed/videoseries?list=PLBI5k9SgYrIvz_h0hq83yFnTM4t9P569b"
            )
        );
    });
});
