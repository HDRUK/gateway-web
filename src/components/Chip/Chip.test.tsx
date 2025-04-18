import Chip from "@/components/Chip";
import { render, screen } from "@/utils/testUtils";

describe("Chip", () => {
    it("should render a chip", () => {
        render(<Chip label="Chippie!" />);
        expect(screen.getByText("Chippie!")).toBeInTheDocument();
    });
});
