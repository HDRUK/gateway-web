import type { Meta, StoryObj } from "@storybook/react";
import HTMLContent from "@/components/HTMLContent";

const meta: Meta<typeof HTMLContent> = {
    component: HTMLContent,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof HTMLContent>;

export const Default: Story = {
    args: {
        content:
            "\n<p>This month we are pleased to share improvements to the usability of the search results page. Plus, we release our data use register widget.</p>\n",
    },
};
