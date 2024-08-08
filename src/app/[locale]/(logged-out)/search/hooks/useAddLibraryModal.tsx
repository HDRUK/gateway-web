"use client";

import { useMemo } from "react";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";
import { NewLibrary } from "@/interfaces/Library";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";

const TRANSLATION_PATH = `pages.search.hooks.useAddLibraryModal`;

interface AddLibraryModalProps {
    onSuccess: () => void;
    onContinue: () => void;
}

const useAddLibraryModal = ({
    onSuccess,
    onContinue,
}: AddLibraryModalProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showModal } = useModal();
    const { user } = useAuth();

    const content = useMemo(() => t("content").toString(), [t]);

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url, {
        localeKey: "updateYourLibrary",
    });

    const onAddLibrary = (datasetId: number) => {
        const payload: NewLibrary = {
            user_id: user?.id,
            dataset_id: datasetId,
        };
        return addLibrary(payload);
    };

    return {
        showLibraryModal: ({ datasetId }: { datasetId: number }) =>
            showModal({
                title: t("title"),
                confirmText: t("confirmText"),
                showCancel: false,
                tertiaryButton: {
                    onAction: () =>
                        onAddLibrary(datasetId).then(() => {
                            onContinue();
                        }),

                    buttonText: t("buttonContinueText"),
                    buttonProps: {
                        color: "secondary",
                        variant: "outlined",
                    },
                },
                content: <Markdown>{content}</Markdown>,
                onSuccess: () => {
                    onAddLibrary(datasetId).then(() => {
                        onSuccess();
                    });
                },
            }),
    };
};

export default useAddLibraryModal;
