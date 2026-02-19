"use client";

import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";
import { Button } from "@mui/material";
import { INTEGRATION_TESTING_URL } from "@/config/hrefs";
import { useTranslations } from "next-intl";
import { DescriptionOutlinedIcon } from "@/consts/icons";
import Link from "@/components/Link";

const Integration = ({ teamId }: { teamId: string }) => {
    const TRANSLATION_PATH = `pages.account.team.integrations.apiManagement`;
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
                    img={StaticImages.TEAM_INTEGRATIONS.createNewIntegration}
                    href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.CREATE}`}
                    buttonText="Create new Integration"
                />
                <ImageMediaCard
                    img={StaticImages.TEAM_INTEGRATIONS.manageIntegrations}
                    href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}`}
                    buttonText="Manage Integrations"
                />
            </Box>
        </Box>
    );
};

export default Integration;
