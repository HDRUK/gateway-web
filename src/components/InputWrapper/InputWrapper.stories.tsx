import type { Meta, StoryObj } from "@storybook/react";
import InputWrapper from "./InputWrapper";

// todo: add story

const meta: Meta<typeof InputWrapper> = {
    component: InputWrapper,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof InputWrapper>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
