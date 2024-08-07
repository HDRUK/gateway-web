import Button from "@/components/Button";
import useDialog from "@/hooks/useDialog";
import Box from "../Box";

type ConfirmType = "button" | "submit" | undefined;
export interface ModalButtonProps {
    onSuccess?: (props: unknown) => void;
    onCancel?: (props: unknown) => void;
    confirmText?: string;
    showCancel?: boolean;
    showConfirm?: boolean;
    formId?: string;
    cancelText?: string;
    confirmType?: ConfirmType;
    tertiaryButton?: { onAction: (props: unknown) => void; buttonText: string };
}

const ModalButtons = ({
    onSuccess,
    onCancel,
    showCancel = true,
    showConfirm = true,
    cancelText = "Cancel",
    formId,
    confirmText = "Confirm",
    confirmType = "button" as ConfirmType,
    tertiaryButton,
}: ModalButtonProps) => {
    const { hideDialog: hideModal } = useDialog();

    const handleSuccess = (props: unknown) => {
        if (typeof onSuccess === "function") {
            onSuccess(props);
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
            <Box
                sx={{
                    p: 0,
                    gap: 2,
                    display: "flex",
                }}>
                {showCancel && (
                    <Button key="cancel" color="inherit" onClick={handleCancel}>
                        {cancelText}
                    </Button>
                )}

                {tertiaryButton && (
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={handleTertiary}>
                        {tertiaryButton.buttonText}
                    </Button>
                )}
                {showConfirm &&
                    (confirmType === "submit" ? (
                        <Button
                            {...(formId && { form: formId })}
                            key="confirm"
                            type="submit">
                            {confirmText}
                        </Button>
                    ) : (
                        <Button
                            key="confirm"
                            type={confirmType}
                            onClick={handleSuccess}>
                            {confirmText}
                        </Button>
                    ))}
            </Box>
        </>
    );
};

export default ModalButtons;
