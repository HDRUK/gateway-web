import type { Meta, StoryObj } from "@storybook/react";
import useModal from "@/hooks/useModal";
import { dialogPropsType } from "@/providers/DialogProvider";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button";

const meta: Meta<typeof Modal> = {
    component: Modal,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Modal>;

const ModalHookExample = (props: dialogPropsType | undefined) => {
    const { showModal } = useModal();
    return <Button onClick={() => showModal(props)}>Open modal</Button>;
};

export const Default: Story = {
    args: {
        title: "This is a modal",
        content: "This is modal content",
    },
};

export const Custom: Story = {
    render: () => {
        const props = {
            title: "This is a modal",
            content: "This is modal content",
            onSuccess: () => console.log("You saved"),
            onCancel: () => console.log("You dismissed"),
            confirmText: "Save",
            cancelText: "Dismiss",
        };
        return <ModalHookExample {...props} />;
    },
};
