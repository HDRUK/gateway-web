import type { Meta, StoryObj } from "@storybook/react";
import CopyTextButton from "./CopyTextButton";

const meta: Meta<typeof CopyTextButton> = {
    component: CopyTextButton,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CopyTextButton>;

export const Default: Story = {
    args: {
        content: "This is the text content that will be copied to clipboard",
    },
    render: props => <CopyTextButton {...props} />,
};
