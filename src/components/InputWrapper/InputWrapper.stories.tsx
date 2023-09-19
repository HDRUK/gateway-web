import type { Meta, StoryObj } from "@storybook/react";
import InputWrapper from "./InputWrapper";

const meta: Meta<typeof InputWrapper> = {
    component: InputWrapper,
};

export default meta;

type Story = StoryObj<typeof InputWrapper>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
