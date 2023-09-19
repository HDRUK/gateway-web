import type { Meta, StoryObj } from "@storybook/react";
import Autocomplete from "./Autocomplete";

const meta: Meta<typeof Autocomplete> = {
    component: Autocomplete,
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
