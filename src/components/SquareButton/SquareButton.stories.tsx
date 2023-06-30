import type { Meta, StoryObj } from "@storybook/react";
import AddIcon from "@mui/icons-material/Add";
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
            <SquareButton
                color="primary"
                icon={<AddIcon sx={{ fontSize: "41px" }} />}>
                With Icon
            </SquareButton>
            <SquareButton color="secondary">Without Icon</SquareButton>
        </Box>
    );
};

export const SquareButtonDemo: Story = {
    render: () => <DummyComponent />,
};
