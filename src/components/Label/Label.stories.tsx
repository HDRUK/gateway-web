import type { Meta, StoryObj } from "@storybook/react";
import Label from "./Label";

/** Mui documentation: https://mui.com/material-ui/react-label */

const meta: Meta<typeof Label> = {
    component: Label,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
    args: {
        label: "Label",
        required: true,
    },
};
