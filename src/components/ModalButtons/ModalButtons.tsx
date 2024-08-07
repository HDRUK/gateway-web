import Button, { ButtonProps } from "@/components/Button";
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
    tertiaryButton?: {
        onAction: (props: unknown) => void;
        buttonText: string;
        buttonProps: ButtonProps;
    };
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
            {showCancel && (
                <Button
                    key="cancel"
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}>
                    {cancelText}
                </Button>
            )}
            <Box
                sx={{
                    p: 0,
                    gap: 2,
                    display: "flex",
                    width: !showCancel && tertiaryButton ? "100%" : undefined,
                    justifyContent:
                        !showCancel && tertiaryButton
                            ? "space-between"
                            : undefined,
                }}>
                {tertiaryButton && (
                    <Button
                        onClick={handleTertiary}
                        color="inherit"
                        {...tertiaryButton.buttonProps}>
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
