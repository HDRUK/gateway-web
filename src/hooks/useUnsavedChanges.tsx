"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModalProps } from "@/components/Modal/Modal";
import useModal from "./useModal";

export interface UnsavedChangesDialogProps {
    shouldConfirmLeave: boolean;
    onCancel?: (url: string) => void;
    onSuccess?: (url: string) => void;
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
    const router = useRouter();
    const { showModal } = useModal();

    const handleShowModal = (href: string) => {
        showModal({
            onCancel: () => {
                if (onCancel) {
                    onCancel(href);
                } else {
                    router.push(href);
                }
            },
            onSuccess: () => {
                onSuccess?.(href);
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
