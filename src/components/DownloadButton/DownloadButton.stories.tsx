import type { Meta, StoryObj } from "@storybook/react";
import DownloadButton from "./DownloadButton";

const meta: Meta<typeof DownloadButton> = {
    component: DownloadButton,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DownloadButton>;

export const Default: Story = {
    args: {
        children: "Download file",
    },
    render: props => <DownloadButton {...props} />,
};
