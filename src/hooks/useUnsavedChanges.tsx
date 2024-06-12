"use client";

import { useEffect } from "react";
import { ModalProps } from "@/components/Modal/Modal";
import useModal from "./useModal";

export interface UnsavedChangesDialogProps {
    shouldConfirmLeave: boolean;
    onLeave?: (url: string) => void;
    onStay?: () => void;
    modalProps?: ModalProps;
}

export const useUnsavedChanges = ({
    onLeave,
    onStay,
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

    const handleShowModal = (href: string) => {
        showModal({
            onCancel: () => {
                onLeave?.(href);
            },
            onSuccess: () => {
                onStay?.();
            },
            confirmText,
            cancelText,
            title,
            content,
        });
    };

    useEffect(() => {
        const handleNavigation = (e: MouseEvent) => {
            e.preventDefault();

            const href = (e.target as HTMLAnchorElement)
                ?.closest("a")
                ?.getAttribute("href");

            if (href) handleShowModal(href);
        };

        if (shouldConfirmLeave) {
            document.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", handleNavigation);
            });
        }

        return () => {
            if (shouldConfirmLeave) {
                document.querySelectorAll("a").forEach(link => {
                    link.removeEventListener("click", handleNavigation);
                });
            }
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldConfirmLeave]);
};
