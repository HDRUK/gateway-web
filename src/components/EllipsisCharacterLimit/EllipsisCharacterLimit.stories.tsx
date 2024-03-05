import type { Meta, StoryObj } from "@storybook/react";
import EllipsisCharacterLimit from "./EllipsisCharacterLimit";

const meta: Meta<typeof EllipsisCharacterLimit> = {
    component: EllipsisCharacterLimit,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EllipsisCharacterLimit>;

export const Default: Story = {
    args: {
        text: "Cras ut sem eu ligula tincidunt aliquet. Lorem ipsum dolor sit amet. Nullam maximus risus et pharetra fringill. Suspendisse porttitor tortor et lectus pulvinar",
    },
};
