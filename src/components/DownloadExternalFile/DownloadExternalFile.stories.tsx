import type { Meta, StoryObj } from "@storybook/react";
import DownloadExternalFile from "./DownloadExternalFile";

const meta: Meta<typeof DownloadExternalFile> = {
    component: DownloadExternalFile,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DownloadExternalFile>;

export const Default: Story = {
    args: {
        buttonText: "Download file",
        apiPath: "api/path",
    },
    render: props => <DownloadExternalFile {...props} />,
};
