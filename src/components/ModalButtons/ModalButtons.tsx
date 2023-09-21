import useDialog from "@/hooks/useDialog";
import Button from "@/components/Button";

type ConfirmType = "button" | "submit" | undefined;
export interface ModalButtonProps {
    onSuccess?: (props: unknown) => void;
    onCancel?: (props: unknown) => void;
    confirmText?: string;
    cancelText?: string;
    confirmType?: ConfirmType;
}

const ModalButtons = ({
    onSuccess,
    onCancel,
    cancelText,
    confirmText,
    confirmType,
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

    return (
        <>
            <Button
                key="cancel"
                variant="outlined"
                color="secondary"
                onClick={handleCancel}>
                {cancelText}
            </Button>
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
        </>
    );
};

ModalButtons.defaultProps = {
    cancelText: "Cancel",
    confirmText: "Confirm",
    confirmType: "button" as ConfirmType,
    onSuccess: () => null,
    onCancel: () => null,
};

export default ModalButtons;
