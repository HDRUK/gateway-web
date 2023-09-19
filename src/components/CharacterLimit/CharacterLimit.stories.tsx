import type { Meta, StoryObj } from "@storybook/react";
import CharacterLimit from "./CharacterLimit";

const meta: Meta<typeof CharacterLimit> = {
    component: CharacterLimit,
};

export default meta;

type Story = StoryObj<typeof CharacterLimit>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
