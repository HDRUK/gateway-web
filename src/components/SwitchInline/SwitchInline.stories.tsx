import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";
import SwitchInline from "./SwitchInline";

/** Mui documentation: https://mui.com/material-ui/react-switch */

const meta: Meta<typeof SwitchInline> = {
    component: SwitchInline,
    title: "Forms/SwitchInline",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SwitchInline>;

export type FormData = {
    toggle: true;
};

const WrapperComponent = (args: { [key: string]: unknown }) => {
    const { control } = useForm<FormData>({});
    return <SwitchInline {...args} control={control} name="toggle" />;
};

export const Default: Story = {
    args: {
        label: "This is the label",
        extraInfo: "This is additional information",
    },
    render: args => <WrapperComponent {...args} />,
};

export const Title: Story = {
    args: {
        label: "This is the label",
        title: "This is the title",
        extraInfo: "This is additional information",
    },
    render: args => <WrapperComponent {...args} />,
};
