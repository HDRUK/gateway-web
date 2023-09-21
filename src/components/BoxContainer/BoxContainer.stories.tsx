import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import BoxContainer from "./BoxContainer";

/**
 * Mui documentation:
 * https://mui.com/material-ui/react-box/
 */

const meta: Meta<typeof BoxContainer> = {
    component: BoxContainer,
    title: "Layout/BoxContainer",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof BoxContainer>;

export const Columns: Story = {
    render: () => (
        <BoxContainer sx={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <Box>Container 1</Box>
            <Box>Container 2</Box>
            <Box>Container 3</Box>
        </BoxContainer>
    ),
};
export const Responsive: Story = {
    render: () => (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(5, 1fr)",
                },
                gap: {
                    mobile: 0,
                    tablet: 1,
                },
            }}>
            <Box sx={{ gridColumn: { tablet: "span 2", laptop: "span 1" } }}>
                Container 1
            </Box>
            <Box sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                Container 2
            </Box>
        </BoxContainer>
    ),
};
