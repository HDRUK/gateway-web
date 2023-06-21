import type { Meta, StoryObj } from "@storybook/react";
import Box from "../Box";
import SquareButton from "./SquareButton";

const meta: Meta<typeof SquareButton> = {
    component: SquareButton,
    title: "AppComponent/SquareButton",
};

export default meta;

type Story = StoryObj<typeof SquareButton>;

const DummyComponent = () => {
    return (
        <Box sx={{ display: "flex", gap: "40px", width: "fit-content" }}>
            <SquareButton>Create API</SquareButton>
            <SquareButton>Manage API</SquareButton>
        </Box>
    );
};

export const SquareButtonDemo: Story = {
    render: () => <DummyComponent />,
};
