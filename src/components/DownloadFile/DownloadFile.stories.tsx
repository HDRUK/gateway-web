import type { Meta, StoryObj } from "@storybook/react";
import DownloadFile from "./DownloadFile";

const meta: Meta<typeof DownloadFile> = {
    component: DownloadFile,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DownloadFile>;

export const Default: Story = {
    args: {
        buttonText: "Download file",
        apiPath: "api/path",
    },
    render: props => <DownloadFile {...props} />,
};
