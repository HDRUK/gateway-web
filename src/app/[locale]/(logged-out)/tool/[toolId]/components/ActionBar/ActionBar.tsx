"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import BackButton from "@/components/BackButton";
import { RouteName } from "@/consts/routeName";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.tool.components.ActionBar";

const ActionBar = () => {
    const router = useRouter();
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <ActionBarWrapper>
            <BackButton
                label={t("label")}
                style={{ margin: 0 }}
                onClick={() =>
                    router.push(
                        `/${RouteName.SEARCH}?type=${SearchCategory.TOOLS}`
                    )
                }
            />
        </ActionBarWrapper>
    );
};

export default ActionBar;
