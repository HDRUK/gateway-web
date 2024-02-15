import type { Meta, StoryObj } from "@storybook/react";
import EllipsisLineLimit from "./EllipsisLineLimit";

const meta: Meta<typeof EllipsisLineLimit> = {
    component: EllipsisLineLimit,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EllipsisLineLimit>;

export const Default: Story = {
    args: {
        text: "Cras ut sem eu ligula tincidunt aliquet. Lorem ipsum dolor sit amet. Nullam maximus risus et pharetra fringill. Suspendisse porttitor tortor et lectus pulvinar",
    },
};
