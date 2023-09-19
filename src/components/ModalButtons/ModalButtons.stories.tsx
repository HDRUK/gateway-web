import type { Meta, StoryObj } from "@storybook/react";
import ModalButtons from "./ModalButtons";

const meta: Meta<typeof ModalButtons> = {
    component: ModalButtons,
};

export default meta;

type Story = StoryObj<typeof ModalButtons>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
