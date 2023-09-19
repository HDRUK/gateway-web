import type { Meta, StoryObj } from "@storybook/react";
import PermissionDescriptions from "./PermissionDescriptions";

const meta: Meta<typeof PermissionDescriptions> = {
    component: PermissionDescriptions,
};

export default meta;

type Story = StoryObj<typeof PermissionDescriptions>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
