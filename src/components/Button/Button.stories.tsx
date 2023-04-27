import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
    title: "components/Button",
    component: Button,
    args: {
        children: "Button",
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        color: "primary",
    },
};

export const Secondary: Story = {
    args: {
        color: "secondary",
    },
};

export const Error: Story = {
    args: {
        color: "error",
    },
};
