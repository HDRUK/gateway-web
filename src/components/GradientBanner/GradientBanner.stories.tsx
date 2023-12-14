import type { Meta, StoryObj } from "@storybook/react";
import GradientBanner from "./GradientBanner";

const meta: Meta<typeof GradientBanner> = {
    component: GradientBanner,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GradientBanner>;

export const Default: Story = {
    args: {
        title: "Gradient Banner Title",
    },
};
