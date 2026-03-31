import { getTranslations } from "next-intl/server";
import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import { RouteName } from "@/consts/routeName";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement`;

export default async function QuestionBankAdminPage() {
    const user = await getUser();
    const permissions = getPermissions(user.roles);
    const t = await getTranslations(TRANSLATION_PATH);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["question-bank.create"]}>
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
        </ProtectedAccountRoute>
    );
}
