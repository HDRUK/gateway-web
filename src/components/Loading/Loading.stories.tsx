import type { Meta, StoryObj } from "@storybook/react";
import Loading from "./Loading";

const meta: Meta<typeof Loading> = {
    component: Loading,
};

export default meta;

type Story = StoryObj<typeof Loading>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
