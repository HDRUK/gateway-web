import type { Meta, StoryObj } from "@storybook/react";
import Box from "./Box";

/**
 * Mui documentation:
 * https://mui.com/material-ui/react-box/
 */

const meta: Meta<typeof Box> = {
    component: Box,
    title: "Layout/Box",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
    args: { children: "This is a box" },
};
