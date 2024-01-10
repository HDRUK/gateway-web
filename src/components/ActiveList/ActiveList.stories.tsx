import type { Meta, StoryObj } from "@storybook/react";
import ActiveList from "./ActiveList";

const meta: Meta<typeof ActiveList> = {
    component: ActiveList,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ActiveList>;

export const Default: Story = {
    args: {
        items: [
            { label: "Item one" },
            { label: "Item two" },
            { label: "Item three" },
        ],
        activeItem: 1,
        handleClick: id => console.log("id: ", id),
    },
};
