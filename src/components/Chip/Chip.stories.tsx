import Stack from "@mui/material/Stack";
import type { Meta, StoryObj } from "@storybook/react";
import ChipComponent from "@/components/Chip";

/** Mui documentation: https://mui.com/material-ui/react-chip/ */

const meta: Meta<typeof ChipComponent> = {
    component: ChipComponent,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ChipComponent>;

export const Default: Story = {
    args: { label: "I'm a chip!" },
};

export const Color: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ChipComponent label="I'm a default Chip" color="default" />
            <ChipComponent label="I'm a primary Chip" color="primary" />
            <ChipComponent label="I'm a secondary Chip" color="secondary" />
            <ChipComponent label="I'm a success Chip" color="success" />
            <ChipComponent label="I'm an info Chip" color="info" />
            <ChipComponent label="I'm a warning Chip" color="warning" />
            <ChipComponent
                label="I'm a warning (amber) Chip"
                color="warningCustom"
            />
            <ChipComponent label="I'm an error Chip" color="error" />
        </Stack>
    ),
};

export const Size: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ChipComponent label="I'm a small Chip" size="small" />
            <ChipComponent label="I'm a medium Chip" size="medium" />
        </Stack>
    ),
};

export const Variant: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ChipComponent label="I'm an outlined Chip" variant="outlined" />
            <ChipComponent label="I'm a filled Chip" variant="filled" />
        </Stack>
    ),
};
