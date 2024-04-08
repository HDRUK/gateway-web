import type { Meta, StoryObj } from "@storybook/react";
import Chip from "../Chip";
import ShowMore from "./ShowMore";

const meta: Meta<typeof ShowMore> = {
    component: ShowMore,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ShowMore>;

export const Default: Story = {
    args: {
        maxHeight: 24,
        children: Array.from({ length: 20 }).map((_, i) => (
            <Chip label={`chip: ${i}`} />
        )),
    },
};
