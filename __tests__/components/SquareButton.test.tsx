import SquareButton from "@/components/SquareButton";
import { render, screen } from "../testUtils";

describe("SquareButton", () => {
    it("Should render component", () => {
        const wrapper = render(<SquareButton />);
        expect(wrapper.container).toBeInTheDocument();
    });
    it("renders the provided child text as button text", () => {
        const childText = "Click me";
        render(<SquareButton>{childText}</SquareButton>);
        expect(screen.getByText(childText)).toBeInTheDocument();
    });
    it("renders the icon if passed as prop", () => {
        const childText = "With icon";
        const icon = <span data-testid="icon" />;
        render(<SquareButton icon={icon}>{childText}</SquareButton>);
        const renderedIcon = screen.getByTestId("icon");
        expect(renderedIcon).toBeInTheDocument();
    });
});
