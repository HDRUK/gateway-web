import type { Meta, StoryObj } from "@storybook/react";
import KeyValueList from "./KeyValueList";

const meta: Meta<typeof KeyValueList> = {
    component: KeyValueList,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof KeyValueList>;

export const Default: Story = {
    args: {
        rows: [
            { key: "one", value: 1 },
            { key: "two", value: 2 },
            { key: "three", value: 3 },
        ],
    },
};
