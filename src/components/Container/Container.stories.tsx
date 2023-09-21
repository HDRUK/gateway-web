import type { Meta, StoryObj } from "@storybook/react";
import Container from "./Container";

/**
 * Mui documentation:
 * https://mui.com/system/react-container/
 */

const meta: Meta<typeof Container> = {
    component: Container,
    title: "Layout/Container",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Container>;

export const MaxWidth: Story = {
    args: {
        children: <div>Max width container</div>,
    },
};
