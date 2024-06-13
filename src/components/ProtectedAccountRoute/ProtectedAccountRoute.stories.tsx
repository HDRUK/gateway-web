import type { Meta, StoryObj } from "@storybook/react";
import ProtectedAccountRoute from "./ProtectedAccountRoute";

const meta: Meta<typeof ProtectedAccountRoute> = {
    component: ProtectedAccountRoute,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ProtectedAccountRoute>;

export const Default: Story = {
    args: {
        permissions: { "cohort.read": false },
        pagePermissions: ["cohort.read"],
        children: null,
    },
};
