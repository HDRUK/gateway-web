import type { Meta, StoryObj } from "@storybook/react";
import DownloadCSV from "./DownloadCSV";

const meta: Meta<typeof DownloadCSV> = {
    component: DownloadCSV,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DownloadCSV>;

export const Default: Story = {
    args: {
        buttonText: "Download csv",
        apiPath: "api/path",
    },
    render: props => <DownloadCSV {...props} />,
};
