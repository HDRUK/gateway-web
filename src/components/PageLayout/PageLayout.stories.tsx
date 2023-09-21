import type { Meta, StoryObj } from "@storybook/react";
import PageLayout from "./PageLayout";

const meta: Meta<typeof PageLayout> = {
    component: PageLayout,
    title: "Layout/PageLayout",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
    args: {
        children: "Page content",
    },
};
