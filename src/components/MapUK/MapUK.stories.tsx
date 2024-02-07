import type { Meta, StoryObj } from "@storybook/react";
import MapUK from "./MapUK";

const meta: Meta<typeof MapUK> = {
    component: MapUK,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MapUK>;

export const Default: Story = {
    args: {
        overrides: {
            wales: true,
        },
        counts: {
            england: 20,
            world: 220,
            wales: 45,
            scotland: 1244,
            northernIreland: 23,
        },
        handleUpdate: updated => console.log(updated),
    },
};
