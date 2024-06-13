import type { Meta, StoryObj } from "@storybook/react";
import TickCrossIcon from "./TickCrossIcon";

const meta: Meta<typeof TickCrossIcon> = {
    component: TickCrossIcon,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TickCrossIcon>;

export const Default: Story = {
    args: {
        isTrue: true,
    },
};
