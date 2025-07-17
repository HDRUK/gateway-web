"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import Typography from "@/components/Typography";
import DarTemplateCreationDialog from "@/modules/DarTemplateCreationDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.team.dar.template`;

const DarTemplatePage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const params = useParams<{
        teamId: string;
    }>();
    const t = useTranslations(TRANSLATION_PATH);

    const { showDialog } = useDialog();

    const payload = {
        team_id: params?.teamId,
        user_id: user?.id,
    };

    const handleCreateTemplate = () => {
        showDialog(DarTemplateCreationDialog, { payload });
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
                    img="/images/dar/template-create.png"
                    onClick={handleCreateTemplate}
                    description={t("create.description")}
                    buttonText={t("create.label")}
                />
                <ImageMediaCard
                    img="/images/dar/template-edit.png"
                    onClick={() =>
                        router.push(
                            `${RouteName.DAR_TEMPLATES}/${RouteName.LIST}/?published=1`
                        )
                    }
                    description={t("manage.description")}
                    buttonText={t("manage.label")}
                />
            </Box>
        </Box>
    );
};

export default DarTemplatePage;
