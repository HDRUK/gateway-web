import type { Meta, StoryObj } from "@storybook/react";
import { AddIcon } from "@/consts/icons";
import SquareButtonComponent from "./SquareButton";

const meta: Meta<typeof SquareButtonComponent> = {
    component: SquareButtonComponent,
};

export default meta;

type Story = StoryObj<typeof SquareButtonComponent>;

export const SquareButton: Story = {
    render: () => (
        <SquareButtonComponent color="secondary">
            Without Icon
        </SquareButtonComponent>
    ),
};

export const WithIcon: Story = {
    render: () => (
        <SquareButtonComponent
            color="primary"
            icon={<AddIcon sx={{ fontSize: "41px" }} />}>
            With Icon
        </SquareButtonComponent>
    ),
};
