import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import Switch from "./Switch";

/** Mui documentation: https://mui.com/material-ui/react-switch */

const meta: Meta<typeof Switch> = {
    component: Switch,
    title: "Forms/Switch",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Switch>;

export type FormData = {
    first: string;
};

const WrapperComponent = (args: { [key: string]: unknown }) => {
    const { control } = useForm<FormData>({});
    return <Switch {...args} control={control} name="first" />;
};

export const SwitchComponent: Story = {
    args: {
        checkedLabel: "On",
        unCheckedLabel: "Off",
    },
    render: args => <WrapperComponent {...args} />,
};
