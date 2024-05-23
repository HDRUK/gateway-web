"use client";

// import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ModalProps } from "@/components/Modal/Modal";
import useModal from "./useModal";

export interface UnsavedChangesDialogProps {
    shouldConfirmLeave: boolean;
    onCancel?: () => void;
    onSuccess?: () => void;
    modalProps?: ModalProps;
}

export const useUnsavedChanges = ({
    onCancel,
    onSuccess,
    shouldConfirmLeave,
    modalProps,
}: UnsavedChangesDialogProps): void => {
    const {
        confirmText = "Stay on page",
        cancelText = "Exit without saving",
        title = "Are you sure you want to exit?",
        content = "Changes are not automatically saved.",
    } = modalProps || {};

    const { showModal } = useModal();
    // const router = useRouter();
    const [nextRouterPath, setNextRouterPath] = useState<string>("");

    const onRouteChangeStart = useCallback(
        (nextPath: string) => {
            if (!shouldConfirmLeave) {
                return;
            }

            setNextRouterPath(nextPath);

            throw Error("cancelRouteChange");
        },
        [shouldConfirmLeave]
    );

    useEffect(() => {
        console.log("helloooo");
        if (!nextRouterPath) return;
        showModal({
            invertCloseIconBehaviour: true,
            onCancel: () => {
                // router.events.off("routeChangeStart", onRouteChangeStart);

                setNextRouterPath("");
                if (typeof onCancel === "function") {
                    onCancel();
                }

                if (nextRouterPath) {
                    // router.push(nextRouterPath);
                }
            },
            onSuccess: () => {
                setNextRouterPath("");
                if (typeof onSuccess === "function") {
                    onSuccess();
                }
            },
            confirmText,
            cancelText,
            title,
            content,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        cancelText,
        confirmText,
        content,
        nextRouterPath,
        onCancel,
        onRouteChangeStart,
        onSuccess,
        title,
    ]);

    // useEffect(() => {
    //     router.events.on("routeChangeStart", onRouteChangeStart);

    //     return () => router.events.off("routeChangeStart", onRouteChangeStart);
    // }, [router, onRouteChangeStart]);
};
