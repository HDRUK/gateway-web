import type { Meta, StoryObj } from "@storybook/react";
import Layout from "./Layout";

const meta: Meta<typeof Layout> = {
    component: Layout,
};

export default meta;

type Story = StoryObj<typeof Layout>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
