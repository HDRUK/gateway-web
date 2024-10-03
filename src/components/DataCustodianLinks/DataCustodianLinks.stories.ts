import type { Meta, StoryObj } from "@storybook/react";
import DataCustodianLinks from "./DataCustodianLinks";

const meta: Meta<typeof DataCustodianLinks> = {
    component: DataCustodianLinks,
    tags: ["autodocs"],
} satisfies Meta<typeof DataCustodianLinks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        data: {
            url: "https://www.hdruk.ac.uk/",
            service: ["https://www.hdruk.ac.uk/", "https://www.google.com"],
        },
    },
};
