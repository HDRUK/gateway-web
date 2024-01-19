import type { Meta, StoryObj } from "@storybook/react";
import ShowMoreTooltip from "./ShowMoreTooltip";

const meta: Meta<typeof ShowMoreTooltip> = {
    component: ShowMoreTooltip,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ShowMoreTooltip>;

export const Default: Story = {
    args: {
        items: ["one", "two", "three, four"],
    },
};
