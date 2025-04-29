"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import BackButton from "@/components/BackButton";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = "pages.collection.components.ActionBar";

const ActionBar = () => {
    const router = useRouter();
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <BackButton
            label={t("label")}
            style={{ margin: 0 }}
            onClick={() =>
                router.push(
                    `/${RouteName.SEARCH}?type=${SearchCategory.COLLECTIONS}`
                )
            }
        />
    );
};

export default ActionBar;
