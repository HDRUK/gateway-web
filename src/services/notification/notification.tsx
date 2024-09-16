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
        ...(typeof options === "object" && { ...options }),
        anchorOrigin: {
            vertical: "top",
            horizontal: "right",
            ...(options?.anchorOrigin && { ...options?.anchorOrigin }),
        },
        variant,
        preventDuplicate: true,
    });
};

const success = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "success", options);
};

const apiSuccess = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "apiSuccess", {
        action: (snackbarId: SnackbarKey) => (
            <DismissButton snackbarId={snackbarId} />
        ),
        ...(typeof options === "object" && { ...options }),
    });
};

const error = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "error", options);
};

const apiError = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "apiError", {
        persist: true,
        ...(typeof options === "object" && { ...options }),
    });
};

const warning = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "warning", options);
};

const apiWarning = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "apiWarning", {
        persist: true,
        action: (snackbarId: SnackbarKey) => (
            <DismissButton snackbarId={snackbarId} />
        ),
        ...(typeof options === "object" && { ...options }),
    });
};

const info = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "info", options);
};

const apiInfo = (
    message: SnackbarKey,
    options?: OptionsWithExtraProps<VariantType>
) => {
    return notification(message, "apiInfo", {
        persist: true,
        action: (snackbarId: SnackbarKey) => (
            <DismissButton snackbarId={snackbarId} />
        ),
        ...(typeof options === "object" && { ...options }),
    });
};

export {
    apiError,
    error,
    apiSuccess,
    success,
    apiWarning,
    warning,
    apiInfo,
    info,
};
