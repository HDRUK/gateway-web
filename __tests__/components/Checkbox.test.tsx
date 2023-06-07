import React from "react";
import Checkbox from "@/components/Checkbox";
import { useForm } from "react-hook-form";
import { render, screen } from "../testUtils";

describe("Checkbox", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        const { control } = useForm();
        return (
            <Checkbox
                label="checkbox label"
                name="fieldName"
                control={control}
                {...props}
            />
        );
    };
    it("should render component", async () => {
        render(<Component />);

        expect(screen.getByText("checkbox label")).toBeInTheDocument();
    });

    it("checkbox snapshot", async () => {
        const wrapper = render(<Component />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
