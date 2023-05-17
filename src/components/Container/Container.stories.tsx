import type { Meta, StoryObj } from "@storybook/react";
import Box from "../Box";
import Container from "./Container";

/**
 * Documents:
 * https://mui.com/system/react-container/
 */

const meta: Meta<typeof Container> = {
    component: Container,
    title: "Layout/Container",
};

export default meta;

type Story = StoryObj<typeof Container>;

export const MaxWidth: Story = {
    render: () => (
        <Container>
            <Box>Max width container</Box>
        </Container>
    ),
};
