"use client";

import { useMemo } from "react";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";
import useModal from "@/hooks/useModal";

const TRANSLATION_PATH = `pages.search.hooks.useAddLibraryModal`;

interface AddLibraryModalProps {
    onAddAndRedirect: () => void;
    onAddAndContinue: () => void;
}

const useAddLibraryModal = ({
    onAddAndRedirect,
    onAddAndContinue,
}: AddLibraryModalProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showModal } = useModal();
    const content = useMemo(() => t("content").toString(), [t]);

    return {
        showLibraryModal: () =>
            showModal({
                title: t("title"),
                confirmText: t("confirmText"),
                showCancel: false,
                tertiaryButton: {
                    onAction: onAddAndContinue,
                    buttonText: t("buttonContinueText"),
                    buttonProps: {
                        color: "secondary",
                        variant: "outlined",
                    },
                },
                content: <Markdown>{content}</Markdown>,
                onSuccess: onAddAndRedirect,
            }),
    };
};

export default useAddLibraryModal;
