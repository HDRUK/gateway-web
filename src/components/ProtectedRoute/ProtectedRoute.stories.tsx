import type { Meta, StoryObj } from "@storybook/react";
import ProtectedRoute from "./ProtectedRoute";

const meta: Meta<typeof ProtectedRoute> = {
    component: ProtectedRoute,
};

export default meta;

type Story = StoryObj<typeof ProtectedRoute>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
