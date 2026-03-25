import type { Meta, StoryObj } from "@storybook/nextjs";
import InitialsBadge from "@/components/InitialsBadge";
import { generateFullName } from "../../../mocks/data/generic";

const meta: Meta<typeof InitialsBadge> = {
    component: InitialsBadge,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof InitialsBadge>;

export const FullName: Story = {
    args: { fullName: generateFullName() },
};

export const Initials: Story = {
    args: { initials: "LB" },
};
