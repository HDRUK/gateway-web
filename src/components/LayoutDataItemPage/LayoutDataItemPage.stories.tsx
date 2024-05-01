import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import type { Meta, StoryObj } from "@storybook/react";
import LayoutDataItemPage from "./LayoutDataItemPage";

const meta: Meta<typeof LayoutDataItemPage> = {
    component: LayoutDataItemPage,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LayoutDataItemPage>;

export const Default: Story = {
    args: {
        navigation: (
            <Box sx={{ height: "500px", backgroundColor: grey["200"] }}>
                Navigation goes here
            </Box>
        ),
        body: (
            <Box sx={{ height: "500px", backgroundColor: grey["200"] }}>
                Body goes here
            </Box>
        ),
    },
};
