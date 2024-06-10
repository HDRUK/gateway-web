"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
    const router = useRouter();
    const [nextRouterPath, setNextRouterPath] = useState<string>("");

    useEffect(() => {
        const handleBrowserNavigation = (e: Event) => {
            e.preventDefault();
        };

        const handleNavigation = (url: string) => {
            router.events.emit("routeChangeError");

            setNextRouterPath(url);

            showModal({
                onCancel: () => {
                    window.removeEventListener(
                        "beforeunload",
                        handleBrowserNavigation
                    );
                    router.events.off("beforeHistoryChange", handleNavigation);

                    setNextRouterPath("");
                    onCancel?.();
                },
                onSuccess: () => {
                    setNextRouterPath("");
                    onSuccess?.();
                },
                confirmText,
                cancelText,
                title,
                content,
            });
        };

        if (shouldConfirmLeave) {
            window.addEventListener("beforeunload", handleBrowserNavigation);
            router.events.on("beforeHistoryChange", handleNavigation);
        }

        return () => {
            if (shouldConfirmLeave) {
                window.removeEventListener(
                    "beforeunload",
                    handleBrowserNavigation
                );
                router.events.off("beforeHistoryChange", handleNavigation);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        cancelText,
        confirmText,
        content,
        nextRouterPath,
        onCancel,
        onSuccess,
        title,
    ]);
};
