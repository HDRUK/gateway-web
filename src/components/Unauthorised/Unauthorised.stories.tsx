import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import Unauthorised from "./Unauthorised";

const meta: Meta<typeof Unauthorised> = {
    component: Unauthorised,
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

type Story = StoryObj<typeof Unauthorised>;

export const Default: Story = {};
