import type { Meta, StoryObj } from "@storybook/react";
import RadioGroup from "./RadioGroup";

// todo: add story

const meta: Meta<typeof RadioGroup> = {
    component: RadioGroup,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
