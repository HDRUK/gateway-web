"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import BackButtonOrig from "@/components/BackButton";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement.updatePage`;

const BackButton = ({ questionId }: { questionId: string }) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();

    const backHref = `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.LIST}`;

    const unlockQuestion = usePatch(`${apis.questionBankV1Url}/questions`, {
        subPath: "unlock",
        successNotificationsOn: false,
    });

    const handleClick = () => {
        unlockQuestion(questionId, {});
        router.push(backHref);
    };

    return <BackButtonOrig label={t("back")} onClick={handleClick} />;
};

export default BackButton;
