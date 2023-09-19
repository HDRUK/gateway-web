import type { Meta, StoryObj } from "@storybook/react";
import CheckboxGroup from "./CheckboxGroup";

const meta: Meta<typeof CheckboxGroup> = {
    component: CheckboxGroup,
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
