import type { Meta, StoryObj } from "@storybook/react";
import ProtectedRoute from "./ProtectedRoute";

const meta: Meta<typeof ProtectedRoute> = {
    component: ProtectedRoute,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ProtectedRoute>;

export const Default: Story = {};
