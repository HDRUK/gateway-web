"use client";

import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import Typography from "@/components/Typography";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.team.dar.template`;

const DarTemplatePage = () => {
    const router = useRouter();
    const { teamId } = useParams<{
        teamId: string;
    }>();
    const t = useTranslations(TRANSLATION_PATH);

    const createNewTemplate = usePost(`${apis.darasV1Url}/dar-templates`, {
        itemName: "DAR Template",
    });

    const handleCreateTemplate = () => {
        //note: hardcoding the user_id for the template for now
        //      when we update permissions, and permission forwarding from the gateway api
        //      then well be able to add user_id to the payload
        //note: may be able to get it from the JWT token on the FE
        //note: may not need it
        const payload = {
            team_id: teamId,
            user_id: "1", //update in the future
        };
        createNewTemplate(payload).then(res => {
            const { id: templateId } = res;
            const redirectUrl = `${RouteName.DAR_TEMPLATE}/${templateId}/${RouteName.EDIT}`;
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
                    href={`/to-be-implemented`}
                    description={t("manage.description")}
                    buttonText={t("manage.label")}
                />
            </Box>
        </Box>
    );
};

export default DarTemplatePage;
