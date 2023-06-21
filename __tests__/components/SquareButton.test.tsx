import SquareButton from "@/components/SquareButton";
import { render, screen } from "../testUtils";

describe("SquareButton from App Component", () => {
    it("Should render component", () => {
        const wrapper = render(<SquareButton />);
        expect(wrapper.container).toBeInTheDocument();
    });
    it("renders the provided child text as button text", () => {
        const childText = "Click me";
        render(<SquareButton>{childText}</SquareButton>);
        expect(screen.getByText(childText)).toBeInTheDocument();
    });
    it('renders the AddIcon when child text is "Create API"', () => {
        const childText = "Create API";
        render(<SquareButton>{childText}</SquareButton>);
        const addIcon = screen.getByTestId("AddIcon");
        expect(addIcon).toBeInTheDocument();
    });
});
