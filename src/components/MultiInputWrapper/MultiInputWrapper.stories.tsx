import type { Meta, StoryObj } from "@storybook/react";
import MultiInputWrapper from "./MultiInputWrapper";

// todo: add story

const meta: Meta<typeof MultiInputWrapper> = {
    component: MultiInputWrapper,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MultiInputWrapper>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
