import type { Meta, StoryObj } from "@storybook/react";
import ScrollContent from "@/components/ScrollContent";

const meta: Meta<typeof ScrollContent> = {
    component: ScrollContent,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ScrollContent>;

export const Default: Story = {
    args: {
        children:
            "\n<p>This month we are pleased to share improvements to the usability of the search results page. Plus, we release our data use register widget.</p>\n",
    },
};
