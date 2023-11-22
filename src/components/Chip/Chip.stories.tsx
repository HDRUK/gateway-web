import type { Meta, StoryObj } from "@storybook/react";
import ChipComponet from "@/components/Chip";
import React from "react";
import Stack from "@mui/material/Stack";

/** Mui documentation: https://mui.com/material-ui/react-chip/ */

const meta: Meta<typeof ChipComponet> = {
    component: ChipComponet,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ChipComponet>;

export const Default: Story = {
    args: { label: "I'm a chip!" },
};

export const Color: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ChipComponet label="I'm a default Chip" color="default" />
            <ChipComponet label="I'm a primary Chip" color="primary" />
            <ChipComponet label="I'm a secondary Chip" color="secondary" />
            <ChipComponet label="I'm a success Chip" color="success" />
            <ChipComponet label="I'm an info Chip" color="info" />
            <ChipComponet label="I'm a warning Chip" color="warning" />
            <ChipComponet
                label="I'm a warning (amber) Chip"
                color="warningAmber"
            />
            <ChipComponet label="I'm an error Chip" color="error" />
        </Stack>
    ),
};

export const Size: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ChipComponet label="I'm a small Chip" size="small" />
            <ChipComponet label="I'm a medium Chip" size="medium" />
        </Stack>
    ),
};

export const Variant: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ChipComponet label="I'm an error Chip" variant="outlined" />
            <ChipComponet label="I'm an error Chip" variant="filled" />
        </Stack>
    ),
};
