import type { Meta, StoryObj } from "@storybook/nextjs";
import Box from "@/components/Box";
import TooltipText from "./TooltipText";

const meta: Meta<typeof TooltipText> = {
    component: TooltipText,
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

type Story = StoryObj<typeof TooltipText>;

export const Default: Story = {
    args: {
        content: "This is the tooltip",
        label: <div>This is the anchor</div>,
    },
};
