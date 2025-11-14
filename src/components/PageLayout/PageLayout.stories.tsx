import type { Meta, StoryObj } from "@storybook/nextjs";
import PageLayout from "./PageLayout";

const meta: Meta<typeof PageLayout> = {
    component: PageLayout,
    title: "Layout/PageLayout",
    tags: ["autodocs"],
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
};

export default meta;

type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
    args: {
        children: "Page content",
    },
};
