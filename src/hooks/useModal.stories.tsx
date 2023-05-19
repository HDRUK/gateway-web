import type { Meta, StoryObj } from "@storybook/react";
import useModal from "@/hooks/useModal";
import Modal from "../components/Modal/Modal";
import Button from "../components/Button";

const meta: Meta<typeof Modal> = {
    component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

const ModalHookExample = () => {
    const { showModal } = useModal();
    return (
        <Button
            onClick={() =>
                showModal({
                    title: "this is a modal title",
                    content: "this is modal content",
                })
            }>
            Launch modal
        </Button>
    );
};

export const Launch: Story = {
    render: () => <ModalHookExample />,
};
