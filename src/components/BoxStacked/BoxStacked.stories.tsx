import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import BoxStacked from "./BoxStacked";

const meta = {
    component: BoxStacked,
    tags: ["autodocs"],
} satisfies Meta<typeof BoxStacked>;

export default meta;

type Story = StoryObj<typeof BoxStacked>;

export const Default: Story = {
    args: {
        sx: { height: "150px", width: "300px" },
        children: (
            <Box
                sx={{
                    backgroundColor: "black",
                    color: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                }}>
                Content
            </Box>
        ),
    },
};
