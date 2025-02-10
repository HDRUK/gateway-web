"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import BackButtonOrig from "@/components/BackButton";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement.updatePage`;

const BackButton = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();

    const backHref = `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.LIST}`;

    const handleClick = () => {
        router.push(backHref);
    };

    return <BackButtonOrig label={t("back")} onClick={handleClick} />;
};

export default BackButton;
