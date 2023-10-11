import type { Meta, StoryObj } from "@storybook/react";
import CopyableTextBox from "./CopyableTextBox";

const meta: Meta<typeof CopyableTextBox> = {
    component: CopyableTextBox,
    title: "Components/CopyableTextBox",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CopyableTextBox>;

export const Default: Story = {
    args: {
        content: "This is the text content that will be copied to clipboard",
    },
    render: props => <CopyableTextBox {...props} />,
};
