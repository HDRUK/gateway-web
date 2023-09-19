import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";

const meta: Meta<typeof Header> = {
    component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
