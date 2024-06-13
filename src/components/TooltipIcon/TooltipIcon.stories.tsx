import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import TooltipIcon from "./TooltipIcon";

const meta: Meta<typeof TooltipIcon> = {
    component: TooltipIcon,
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

type Story = StoryObj<typeof TooltipIcon>;

export const Default: Story = {
    args: {
        content: "This is the tooltip",
        label: <div>This is the anchor</div>,
    },
};
