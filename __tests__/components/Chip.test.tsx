import ChipComponent from "@/components/Chip";
import { render, screen } from "../testUtils";

describe("ChipComponent", () => {
    it("should render a chip", () => {
        render(<ChipComponent label="Chippie!" />);
        expect(screen.getByText("Chippie!")).toBeInTheDocument();
    });
});
