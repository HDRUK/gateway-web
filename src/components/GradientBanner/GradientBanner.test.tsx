import { render, screen } from "@/utils/testUtils";
import GradientBanner from "./GradientBanner";

describe("GradientBanner", () => {
    it("should render title", () => {
        render(<GradientBanner title="GradientBanner Title" />);
        expect(screen.getByText("GradientBanner Title")).toBeInTheDocument();
    });
});
