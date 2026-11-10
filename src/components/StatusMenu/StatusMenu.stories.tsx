import type { Meta, StoryObj } from "@storybook/nextjs";
import { DataStatus } from "@/consts/application";
import StatusMenu from "./StatusMenu";

const meta: Meta<typeof StatusMenu> = {
    component: StatusMenu,
    tags: ["autodocs"],
    args: {
        onChange: () => {},
    },
};

export default meta;

type Story = StoryObj<typeof StatusMenu>;

export const Active: Story = {
    args: { status: DataStatus.ACTIVE },
};

export const Draft: Story = {
    args: { status: DataStatus.DRAFT },
};

export const Archived: Story = {
    args: { status: DataStatus.ARCHIVED },
};
