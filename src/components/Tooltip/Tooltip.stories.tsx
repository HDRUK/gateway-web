import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import Tooltip from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
    component: Tooltip,
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

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    args: {
        title: "This is the tooltip",
        children: <div>This is the anchor</div>,
    },
};
