import type { Meta, StoryObj } from "@storybook/react";
import BackButton from "./BackButton";

const meta: Meta<typeof BackButton> = {
    component: BackButton,
    tags: ["autodocs"],
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
};

export default meta;

type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
    args: {
        label: "Back",
    },
};
