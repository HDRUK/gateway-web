import { useForm } from "react-hook-form";
import SwitchInline from "@/components/SwitchInline";
import { render, screen } from "@/utils/testUtils";

describe("SwitchInline", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        const { control } = useForm();
        return (
            <SwitchInline
                label="This is the label"
                extraInfo="This is additional information"
                name="toggleSwitch"
                control={control}
                {...props}
            />
        );
    };
    it("renders the component with correct labels", () => {
        render(<Component />);

        const label = screen.getByText("This is the label");
        const extraInfo = screen.getByText("This is additional information");

        expect(label).toBeInTheDocument();
        expect(extraInfo).toBeInTheDocument();
    });
});
