import type { Meta, StoryObj } from "@storybook/react";
import useModal from "@/hooks/useModal";
import { dialogPropsType } from "@/providers/Dialog/DialogProvider";
import Modal from "../components/Modal/Modal";
import Button from "../components/Button";

const meta: Meta<typeof Modal> = {
    component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

const ModalHookExample = (props: dialogPropsType | undefined) => {
    const { showModal } = useModal();
    return <Button onClick={() => showModal(props)}>Open modal</Button>;
};

export const Basic: Story = {
    render: () => {
        const props = {
            title: "This is a modal",
            content: "This is modal content",
        };
        return <ModalHookExample {...props} />;
    },
};

export const Custom: Story = {
    render: () => {
        const props = {
            title: "This is a modal",
            content: "This is modal content",
            onSuccess: () => alert("You saved"),
            onCancel: () => alert("You dismissed"),
            confirmText: "Save",
            cancelText: "Dismiss",
        };
        return <ModalHookExample {...props} />;
    },
};
