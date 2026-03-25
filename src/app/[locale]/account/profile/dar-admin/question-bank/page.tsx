"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import Typography from "@/components/Typography";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement`;

const QuestionBankAdminPage = () => {
    const t = useTranslations(TRANSLATION_PATH);
    return (
        <Box
            sx={{
                gridColumn: { tablet: "span 3", laptop: "span 4" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
            <Typography variant="h2">{t("title")}</Typography>

            <Box sx={{ display: "flex", gap: "40px" }}>
                <ImageMediaCard
                    img="/images/dar/question-create.png"
                    href={`/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.CREATE}`}
                    description={t("create.description")}
                    buttonText={t("create.label")}
                />
                <ImageMediaCard
                    img="/images/dar/question-edit.png"
                    href={`/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.LIST}`}
                    description={t("manage.description")}
                    buttonText={t("manage.label")}
                />
            </Box>
        </Box>
    );
};

export default QuestionBankAdminPage;
