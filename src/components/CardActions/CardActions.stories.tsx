import type { Meta, StoryObj } from "@storybook/react";
import { ArchiveIcon, EditIcon } from "@/consts/icons";
import CardActions from "./CardActions";

const meta: Meta<typeof CardActions> = {
    component: CardActions,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CardActions>;

export const Default: Story = {
    args: {
        id: 1,
        actions: [
            {
                label: "First item",
                icon: EditIcon,
                href: "/this/is/the/href",
            },
            {
                label: "Second item",
                icon: ArchiveIcon,
                action: (id: number) => console.log(id),
            },
        ],
    },
};
