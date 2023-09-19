import type { Meta, StoryObj } from "@storybook/react";
import Paper from "./Paper";

const meta: Meta<typeof Paper> = {
    component: Paper,
};

export default meta;

type Story = StoryObj<typeof Paper>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
