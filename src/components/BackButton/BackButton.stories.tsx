import type { Meta, StoryObj } from "@storybook/react";
import BackButton from "./BackButton";

const meta: Meta<typeof BackButton> = {
    component: BackButton,
};

export default meta;

type Story = StoryObj<typeof BackButton>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
