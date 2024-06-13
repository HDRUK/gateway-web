import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import FormError from "./FormError";

const meta: Meta<typeof FormError> = {
    component: FormError,
    title: "Forms/FormError",
    parameters: {
        layout: "fullscreen",
    },
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

type Story = StoryObj<typeof FormError>;

export const Default: Story = {
    args: {
        error: [
            { message: "Min not met", type: "max" },
            { message: "Max exceeded", type: "max" },
        ],
    },
};
