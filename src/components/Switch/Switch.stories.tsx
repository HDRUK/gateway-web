import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
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

export const Default: Story = {
    args: {
        checkedLabel: "On",
        unCheckedLabel: "Off",
    },
    render: args => <WrapperComponent {...args} />,
};

export const Size: Story = {
    args: {
        checkedLabel: "On",
        unCheckedLabel: "Off",
    },
    render: args => (
        <Stack maxWidth={300}>
            <WrapperComponent {...args} size="small" />
            <WrapperComponent {...args} size="medium" />
            <WrapperComponent {...args} size="large" />
        </Stack>
    ),
};
