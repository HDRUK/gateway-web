import type { Meta } from "@storybook/react";
import WPContent from "@/components/WPContent";
import { WPContentProps } from "./WPContent";

const meta: Meta<typeof WPContent> = {
    component: WPContent,
};

export default meta;

export const Playground = (args: WPContentProps) => <WPContent {...args} />;

Playground.args = {
    content:
        "\n<p>This month we are pleased to share improvements to the usability of the search results page. Plus, we release our data use register widget.</p>\n",
};
