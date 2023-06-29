import ToggleButton from "@/components/ToggleButton";
import { render, screen } from "../testUtils";

describe("ToggleButton", () => {
    it("renders the component with correct labels", () => {
        const checkedLabel = "On";
        const unCheckedLabel = "Off";
        render(
            <ToggleButton
                checkedLabel={checkedLabel}
                unCheckedLabel={unCheckedLabel}
            />
        );

        const uncheckedText = screen.getByText(unCheckedLabel);
        const checkedText = screen.getByText(checkedLabel);

        expect(uncheckedText).toBeInTheDocument();
        expect(checkedText).toBeInTheDocument();
    });
});
