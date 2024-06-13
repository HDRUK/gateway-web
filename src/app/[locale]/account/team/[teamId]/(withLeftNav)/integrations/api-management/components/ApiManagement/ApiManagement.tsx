"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Box from "@/components/Box";
import Button from "@/components/Button";
import ImageMediaCard from "@/components/ImageMediaCard";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import { INTEGRATION_TESTING_URL } from "@/config/hrefs";
import { DescriptionOutlinedIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.team.integrations.apiManagement`;

const ApiManagement = () => {
    const params = useParams<{ teamId: string }>();
    const t = useTranslations(TRANSLATION_PATH);
    return (
        <Box
            sx={{
                gridColumn: { tablet: "span 3", laptop: "span 4" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
            <Link passHref target="_blank" href={INTEGRATION_TESTING_URL}>
                <Button
                    sx={{ fontSize: 16 }}
                    startIcon={
                        <DescriptionOutlinedIcon
                            sx={{ height: 24, width: 24 }}
                        />
                    }
                    variant="link">
                    {t("howTo")}
                </Button>
            </Link>
            <Box sx={{ display: "flex", gap: "40px" }}>
                <ImageMediaCard
                    img="/images/account/teams/api-management/create.jpg"
                    href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.CREATE}`}
                    description="Create API-keys and link to the Gateway"
                    buttonText="Create API-Key"
                />
                <ImageMediaCard
                    img="/images/account/teams/api-management/manage.jpg"
                    href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.LIST}`}
                    description="Manage your linked APIs"
                    buttonText="Manage API"
                />
            </Box>
            <Typography sx={{ fontSize: "20px" }}>
                {t("cannotCreate")}
            </Typography>
        </Box>
    );
};

export default ApiManagement;
