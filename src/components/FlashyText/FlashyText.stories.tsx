import type { Meta, StoryObj } from "@storybook/react";
import FlashyText from "./FlashyText";

const meta: Meta<typeof FlashyText> = {
    component: FlashyText,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FlashyText>;

export const Default: Story = {
    args: {
        text: "Cras ut sem eu ligula tincidunt aliquet.",
    },
};
