import type { Meta, StoryObj } from "@storybook/react";
import TitlePanel from "./TitlePanel";

const meta: Meta<typeof TitlePanel> = {
    component: TitlePanel,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TitlePanel>;

export const Default: Story = {
    args: {
        title: "This is a title",
        text: "This is a sub text",
        image: "/images/homepage/welcome-image.webp",
    },
};
