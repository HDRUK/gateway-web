import type { Meta, StoryObj } from "@storybook/nextjs";
import Loading from "./Loading";

const meta: Meta<typeof Loading> = {
    component: Loading,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Default: Story = {};
