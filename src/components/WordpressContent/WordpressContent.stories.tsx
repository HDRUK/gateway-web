import type { Meta, StoryObj } from "@storybook/react";
import WordpressContent from "@/components/WordpressContent";

const meta: Meta<typeof WordpressContent> = {
    component: WordpressContent,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof WordpressContent>;

export const Default: Story = {
    args: {
        content:
            "\n<p>This month we are pleased to share improvements to the usability of the search results page. Plus, we release our data use register widget.</p>\n",
    },
};
