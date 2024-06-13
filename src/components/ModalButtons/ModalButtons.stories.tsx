import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import ModalButtons from "./ModalButtons";

const meta: Meta<typeof ModalButtons> = {
    component: ModalButtons,
    tags: ["autodocs"],
    decorators: [
        Story => (
            <Stack direction="row" gap={2}>
                <Story />
            </Stack>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof ModalButtons>;

export const Default: Story = {
    args: {
        onSuccess: () => console.log("Success"),
        onCancel: () => console.log("Cancel"),
        cancelText: "Dismiss",
        confirmText: "Save",
    },
};
