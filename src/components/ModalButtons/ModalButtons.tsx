import useDialog from "@/hooks/useDialog";
import Button from "@/components/Button";
import Box from "../Box";

type ConfirmType = "button" | "submit" | undefined;
export interface ModalButtonProps {
    onSuccess?: (props: unknown) => void;
    onCancel?: (props: unknown) => void;
    confirmText?: string;
    cancelText?: string;
    confirmType?: ConfirmType;
    tertiaryButton?: { onAction: (props: unknown) => void; buttonText: string };
}

const ModalButtons = ({
    onSuccess,
    onCancel,
    cancelText = "Cancel",
    confirmText = "Confirm",
    confirmType = "button" as ConfirmType,
    tertiaryButton,
}: ModalButtonProps) => {
    const { hideDialog: hideModal } = useDialog();

    const handleSuccess = async (props: unknown) => {
        if (typeof onSuccess === "function") {
            const success = await onSuccess(props);
            //dont hide the model if the handle of the successful click
            //custom returned false
            if (success != undefined && success) return;
        }
        hideModal();
    };

    const handleCancel = (props: unknown) => {
        if (typeof onCancel === "function") {
            onCancel(props);
        }
        hideModal();
    };

    const handleTertiary = (props: unknown) => {
        if (typeof tertiaryButton?.onAction === "function") {
            tertiaryButton.onAction(props);
        }
        hideModal();
    };

    return (
        <>
            <Button
                key="cancel"
                variant="outlined"
                color="secondary"
                onClick={handleCancel}>
                {cancelText}
            </Button>
            <Box sx={{ p: 0, gap: 2, display: "flex" }}>
                {tertiaryButton && (
                    <Button color="inherit" onClick={handleTertiary}>
                        {tertiaryButton.buttonText}
                    </Button>
                )}
                {confirmType === "submit" ? (
                    <Button key="confirm" type="submit">
                        {confirmText}
                    </Button>
                ) : (
                    <Button
                        key="confirm"
                        type={confirmType}
                        onClick={handleSuccess}>
                        {confirmText}
                    </Button>
                )}
            </Box>
        </>
    );
};

export default ModalButtons;
