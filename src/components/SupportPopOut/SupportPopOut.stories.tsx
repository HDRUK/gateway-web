import type { Meta, StoryObj } from "@storybook/react";
import SupportPopOut from "./SupportPopOut";

const meta: Meta<typeof SupportPopOut> = {
    component: SupportPopOut,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SupportPopOut>;

export const Default: Story = {};
