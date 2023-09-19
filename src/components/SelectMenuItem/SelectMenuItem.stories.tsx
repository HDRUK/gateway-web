import type { Meta, StoryObj } from "@storybook/react";
import SelectMenuItem from "./SelectMenuItem";

const meta: Meta<typeof SelectMenuItem> = {
    component: SelectMenuItem,
};

export default meta;

type Story = StoryObj<typeof SelectMenuItem>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
