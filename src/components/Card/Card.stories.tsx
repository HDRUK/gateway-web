import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

/**
 * Mui documentation:
 * https://mui.com/material-ui/react-card/
 */

const meta: Meta<typeof Card> = {
    component: Card,
    title: "Cards/Card",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        children: <div>Card content</div>,
    },
};
