"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.team.dar.template`;

const DarTemplatePage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const params = useParams<{
        teamId: string;
    }>();
    const t = useTranslations(TRANSLATION_PATH);

    const createNewTemplate = usePost(apis.dataAccessTemplateV1Url, {
        itemName: "DAR Template",
    });

    const handleCreateTemplate = () => {
        const payload = {
            team_id: params?.teamId,
            user_id: user?.id,
        };
        createNewTemplate(payload).then(res => {
            const templateId = res;
            const redirectUrl = `${RouteName.DAR_TEMPLATES}/${templateId}/${RouteName.EDIT}`;
            router.push(redirectUrl);
        });
    };

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
                    img=""
                    onClick={handleCreateTemplate}
                    description={t("create.description")}
                    buttonText={t("create.label")}
                />
                <ImageMediaCard
                    img=""
                    href="/to-be-implemented"
                    description={t("manage.description")}
                    buttonText={t("manage.label")}
                />
            </Box>
        </Box>
    );
};

export default DarTemplatePage;
