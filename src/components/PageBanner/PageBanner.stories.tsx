import type { Meta, StoryObj } from "@storybook/nextjs";
import PageBanner from "./PageBanner";

const meta: Meta<typeof PageBanner> = {
    component: PageBanner,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PageBanner>;

export const Default: Story = {
    args: {
        backgroundImageUrl: "/images/collections/banner.jpeg",
        children: "Lorem Ipsum",
    },
};
