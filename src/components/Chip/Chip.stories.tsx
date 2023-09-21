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
            <ChipComponet label="I'm a Chip too!" color="primary" />
            <ChipComponet label="I'm a Chip too!" color="success" />
            <ChipComponet label="I'm a Chip too!" color="info" />
            <ChipComponet label="I'm a Chip too!" color="warning" />
            <ChipComponet label="I'm a Chip too!" color="error" />
        </Stack>
    ),
};

export const Size: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ChipComponet label="I'm a Chip too!" size="small" />
            <ChipComponet label="I'm a Chip!" size="medium" />
        </Stack>
    ),
};

export const Variant: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ChipComponet label="I'm a Chip too!" variant="outlined" />
            <ChipComponet label="I'm a Chip too!" variant="filled" />
        </Stack>
    ),
};
