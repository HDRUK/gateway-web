import type { Meta, StoryObj } from "@storybook/react";
import MapUK from "./MapUK";

const meta: Meta<typeof MapUK> = {
    component: MapUK,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MapUK>;

export const Default: Story = {};
