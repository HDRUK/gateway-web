import type { Meta, StoryObj } from "@storybook/react";
import HomepageTitlePanel from "./HomepageTitlePanel";

const meta: Meta<typeof HomepageTitlePanel> = {
    component: HomepageTitlePanel,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof HomepageTitlePanel>;

export const Default: Story = {
    args: {
        title: "This is a title",
        text: "This is a sub text",
        image: "/images/homepage/welcome-image.png",
    },
};
