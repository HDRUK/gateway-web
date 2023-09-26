import type { Meta, StoryObj } from "@storybook/react";
import BulletList from "./BulletList";

const meta: Meta<typeof BulletList> = {
    component: BulletList,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof BulletList>;

export const Default: Story = {
    args: {
        items: [
            { label: "Item one" },
            { label: "Item two" },
            { label: "Item three" },
        ],
    },
};
