import type { Meta, StoryObj } from "@storybook/react";
import Paper from "./Paper";

/** Mui documentation: https://mui.com/material-ui/react-paper */

const meta: Meta<typeof Paper> = {
    component: Paper,
    title: "Layout/Paper",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Paper>;

export const Default: Story = {
    args: {
        children: <div>content</div>,
    },
};
