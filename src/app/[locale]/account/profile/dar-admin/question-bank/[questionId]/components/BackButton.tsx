"use client";

import { useTranslations } from "next-intl";
import BackButtonOrig from "@/components/BackButton";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement.updatePage`;

const BackButton = ({ questionId }: { questionId: string }) => {
    const t = useTranslations(TRANSLATION_PATH);
    const unlockQuestion = usePatch(`${apis.questionBankV1Url}/questions`, {
        subPath: "unlock",
        successNotificationsOn: false,
    });

    const handleClick = () => {
        unlockQuestion(questionId, {});
    };

    return <BackButtonOrig label={t("back")} onClick={handleClick} />;
};

export default BackButton;
