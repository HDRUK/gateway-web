import {
    OptionsWithExtraProps,
    SnackbarKey,
    VariantType,
    closeSnackbar,
    enqueueSnackbar,
} from "notistack";

const DismissButton = ({ snackbarId }: { snackbarId: SnackbarKey }) => {
    return (
        <button type="button" onClick={() => closeSnackbar(snackbarId)}>
            Dismiss
        </button>
    );
};

const notification = (
    message: SnackbarKey,
    variant: VariantType,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return enqueueSnackbar(message, {
        ...options,
        anchorOrigin: {
            vertical: "top",
            horizontal: "right",
            ...(options?.anchorOrigin && { ...options?.anchorOrigin }),
        },
        variant,
    });
};

const success = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "success", options);
};

const error = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "error", options);
};

const warning = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "warning", options);
};

const info = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "info", options);
};

const apiError = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "apiError", {
        persist: "true",
        action: (snackbarId: SnackbarKey) => (
            <DismissButton snackbarId={snackbarId} />
        ),
        ...options,
    });
};

export { apiError, error, success, warning, info };
