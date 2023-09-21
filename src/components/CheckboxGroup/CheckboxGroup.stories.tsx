import type { Meta, StoryObj } from "@storybook/react";
import CheckboxGroup from "./CheckboxGroup";

// todo: add story

const meta: Meta<typeof CheckboxGroup> = {
    component: CheckboxGroup,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
