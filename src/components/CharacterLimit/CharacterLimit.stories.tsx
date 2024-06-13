import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import CharacterLimit from "./CharacterLimit";

const meta: Meta<typeof CharacterLimit> = {
    component: CharacterLimit,
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

type Story = StoryObj<typeof CharacterLimit>;

export const Default: Story = {
    args: { limit: 300, count: 200 },
};
