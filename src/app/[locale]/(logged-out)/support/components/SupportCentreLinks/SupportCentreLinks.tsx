"use client";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import {
    FeatureCard,
    FeatureCardBody,
    FeatureCardHeading,
} from "@/components/FeatureCard";
import { SUPPORT_METADATA_ONBOARDING_URL } from "@/consts/application";
import {
    CohortDiscoveryIcon,
    DatabaseIcon,
    SendIcon,
    TeamIcon,
} from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "../ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.support";

export default function MeetTheTeam() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);
    const router = useRouter();

    const data = [
        {
            heading: t("cohortDiscoveryTitle"),
            body: t("cohortDiscoveryDescription"),
            link: RouteName.SUPPORT_COHORT_DISCOVERY,
            icon: <CohortDiscoveryIcon />,
        },
        {
            heading: t("darTitle"),
            body: t("darDescription"),
            link: RouteName.SUPPORT_DAR,
            icon: <SendIcon />,
        },
        {
            heading: t("durTitle"),
            body: t("durDescription"),
            link: RouteName.SUPPORT_DUR,
            icon: <SendIcon />,
        },
        {
            heading: t("metadataOnboardingTitle"),
            body: t("metadataOnboardingDescription"),
            link: SUPPORT_METADATA_ONBOARDING_URL,
            icon: <DatabaseIcon />,
        },
        {
            heading: t("searchTitle"),
            body: t("searchDescription"),
            link: RouteName.HOW_TO_SEARCH,
            icon: <SearchIcon />,
        },
        {
            heading: t("toolsTitle"),
            body: t("toolsDescription"),
            link: RouteName.SUPPORT_TOOLS,
            icon: <CloudUploadIcon />,
        },
        {
            heading: t("teamManagementTitle"),
            body: t("teamManagementDescription"),
            link: RouteName.SUPPORT_TEAM_MANAGEMENT,
            icon: <TeamIcon />,
        },
        {
            heading: t("gatewaySchemaTitle"),
            body: t("gatewaySchemaDescription"),
            link: RouteName.SUPPORT_SCHEMA,
            icon: <DescriptionIcon />,
        },
    ];

    return (
        <>
            <Banner title={t("title")} />
            <Container sx={{ background: "white", p: 10 }}>
                <Grid container columnSpacing={6} rowSpacing={6}>
                    {data.map(({ heading, body, icon, link }) => (
                        <Grid
                            item
                            tablet={4}
                            mobile={6}
                            desktop={3}
                            sx={{ p: 0 }}>
                            <FeatureCard
                                role="button"
                                icon={icon}
                                onClick={() => router.push(link)}>
                                <FeatureCardHeading>
                                    {heading}
                                </FeatureCardHeading>
                                <FeatureCardBody>{body}</FeatureCardBody>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 20 }}>
                    <ContactSupport />
                </Box>
            </Container>
        </>
    );
}
