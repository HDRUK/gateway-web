import type { Meta, StoryObj } from "@storybook/nextjs";
import ShowingXofX from "./ShowingXofX";

const meta: Meta<typeof ShowingXofX> = {
    component: ShowingXofX,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ShowingXofX>;

export const Default: Story = {
    args: {
        from: 1,
        to: 5,
        total: 25,
    },
};
