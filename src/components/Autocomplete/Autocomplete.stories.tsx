import type { Meta, StoryObj } from "@storybook/react";
import Autocomplete from "./Autocomplete";

// todo: add story and missing component features

const meta: Meta<typeof Autocomplete> = {
    component: Autocomplete,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
