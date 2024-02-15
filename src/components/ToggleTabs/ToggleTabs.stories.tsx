import type { Meta, StoryObj } from "@storybook/react";
import { ViewListIcon, AppsIcon } from "@/consts/icons";
import ToggleTabs from "./ToggleTabs";

const meta: Meta<typeof ToggleTabs> = {
    component: ToggleTabs,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ToggleTabs>;

export const Default: Story = {
    args: {
        selected: "table",
        buttons: [
            {
                icon: AppsIcon,
                label: "Table",
                value: "table",
            },
            {
                icon: ViewListIcon,
                label: "List",
                value: "list",
            },
        ],
    },
};
