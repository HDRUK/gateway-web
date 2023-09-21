import React from "react";
import CheckboxRow from "@/components/CheckboxRow";
import { useForm } from "react-hook-form";
import { render, screen } from "@/utils/testUtils";

describe("CheckboxRow", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        const { control } = useForm();
        return (
            <CheckboxRow
                label="checkbox label"
                name="fieldName"
                title="Name"
                control={control}
                {...props}
            />
        );
    };
    it("should render component", async () => {
        const wrapper = render(<Component />);
        expect(wrapper.container).toMatchSnapshot();
    });

    it("should render title", async () => {
        render(<Component />);
        expect(screen.getByText("Name")).toBeInTheDocument();
    });
});
