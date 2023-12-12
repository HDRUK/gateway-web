import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import CheckboxGroup from "./CheckboxGroup";

const meta: Meta<typeof CheckboxGroup> = {
    component: CheckboxGroup,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

const WrapperComponent = () => {
    const { control } = useForm();

    const checkboxes = [
        {
            label: "Test 1",
            value: "test1",
        },
        {
            label: "Test 2",
            value: "test2",
        },
    ];

    return (
        <CheckboxGroup
            control={control}
            direction="row"
            label="Which?"
            name="test"
            spacing={2}
            checkboxes={checkboxes}
        />
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
