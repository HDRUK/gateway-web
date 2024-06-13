import Stack from "@mui/material/Stack";
import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import ErrorDisplay from "./ErrorDisplay";

const meta: Meta<typeof ErrorDisplay> = {
    component: ErrorDisplay,
    tags: ["autodocs"],
    decorators: [
        Story => (
            <Box sx={{ width: 200 }}>
                <Story />
            </Box>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof ErrorDisplay>;

export const Default: Story = { args: { variant: 401 } };

export const Variant: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <ErrorDisplay variant={401} />
            <ErrorDisplay variant={403} />
        </Stack>
    ),
};
