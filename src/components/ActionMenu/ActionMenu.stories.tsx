import type { Meta, StoryObj } from "@storybook/react";
import { CloseIcon, EditIcon } from "@/consts/icons";
import ActionMenu from "./ActionMenu";

const meta: Meta<typeof ActionMenu> = {
    component: ActionMenu,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ActionMenu>;

export const Default: Story = {
    args: {
        actions: [
            {
                label: "Edit",
                action: () => console.log("edit"),
                icon: EditIcon,
            },
            {
                label: "Delete",
                action: () => console.log("delete"),
                icon: CloseIcon,
            },
        ],
        label: "Open menu",
    },
};
