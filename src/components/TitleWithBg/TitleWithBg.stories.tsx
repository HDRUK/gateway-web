import type { Meta, StoryObj } from "@storybook/react";
import TitleWithBg from "./TitleWithBg";

const meta: Meta<typeof TitleWithBg> = {
    component: TitleWithBg,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TitleWithBg>;

export const Default: Story = {
    args: {
        title: "This is a title",
    },
};
