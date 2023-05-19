import type { Meta, StoryObj } from "@storybook/react";
import SignInDialog from "@/modules/dialogs/SignInDialog";
import Button from "@/components/Button";
import useDialog from "./useDialog";

const meta: Meta<typeof SignInDialog> = {
    component: SignInDialog,
};

export default meta;

type Story = StoryObj<typeof SignInDialog>;

const DialogHookExample = () => {
    const { showDialog } = useDialog();
    return (
        <Button onClick={() => showDialog(SignInDialog)}>Launch Dialog</Button>
    );
};

export const Launch: Story = {
    render: () => <DialogHookExample />,
};
