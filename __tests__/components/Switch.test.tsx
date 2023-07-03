import { useForm } from "react-hook-form";
import Switch from "@/components/Switch/Switch";
import { render, screen } from "../testUtils";

describe("Switch", () => {
    const checkedLabel = "On";
    const unCheckedLabel = "Off";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        const { control } = useForm();
        return (
            <Switch
                checkedLabel={checkedLabel}
                unCheckedLabel={unCheckedLabel}
                name="toggleSwitch"
                control={control}
                {...props}
            />
        );
    };
    it("renders the component with correct labels", () => {
        render(<Component />);

        const uncheckedText = screen.getByText(unCheckedLabel);
        const checkedText = screen.getByText(checkedLabel);

        expect(uncheckedText).toBeInTheDocument();
        expect(checkedText).toBeInTheDocument();
    });
});
