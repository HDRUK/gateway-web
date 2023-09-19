import type { Meta, StoryObj } from "@storybook/react";
import Form from "./Form";

const meta: Meta<typeof Form> = {
    component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
