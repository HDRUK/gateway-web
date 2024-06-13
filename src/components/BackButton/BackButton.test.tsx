import BackButton from "@/components/BackButton";
import { render, screen } from "@/utils/testUtils";

describe("BackButton", () => {
    it("should render a back button", () => {
        render(<BackButton label="Back Button Yay!" />);
        expect(screen.getByText("Back Button Yay!")).toBeInTheDocument();
    });
});
