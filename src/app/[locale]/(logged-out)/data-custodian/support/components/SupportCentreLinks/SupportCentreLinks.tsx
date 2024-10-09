"use client";

import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { FeatureCard, FeatureCardHeading } from "@/components/FeatureCard";
import {
    CohortDiscoveryIcon,
    CollectionsIcon,
    DataAccessRequestIcon,
    DataCustodiansIcon,
    DataUseIcon,
    MetadataOnboardingIcon,
    PublicationIcon,
    SendIcon,
    TheAllianceIcon,
    ToolIcon,
} from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "@/app/[locale]/(logged-out)/support/components/ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.dataCustodianSupport";

export default function MeetTheTeam() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);
    const router = useRouter();

    const data = [
        {
            heading: t("gettingStartedTitle"),
            link: RouteName.DATA_CUSTODIAN_GETTING_STARTED,
            icon: <DataCustodiansIcon />,
        },
        {
            heading: t("metadataOnboardingTitle"),
            link: RouteName.DATA_CUSTODIAN_METADATA_ONBOARDING,
            icon: <MetadataOnboardingIcon />,
        },
        {
            heading: t("uploadingDataUsesProjectsTitle"),
            link: RouteName.DATA_CUSTODIAN_UPLOADING_DATAUSES_PROJECTS,
            icon: <DataUseIcon />,
        },
        {
            heading: t("onboardingCohortDiscoveryTitle"),
            link: RouteName.DATA_CUSTODIAN_COHORT_DISCOVERY,
            icon: <CohortDiscoveryIcon />,
        },
        {
            heading: t("uploadingToolsTitle"),
            link: RouteName.DATA_CUSTODIAN_TOOLS,
            icon: <ToolIcon />,
        },
        {
            heading: t("uploadingPublicationsTitle"),
            link: RouteName.DATA_CUSTODIAN_PUBLICATIONS,
            icon: <PublicationIcon />,
        },
        {
            heading: t("managingCollectionsTitle"),
            link: RouteName.DATA_CUSTODIAN_MANAGING_COLLECTIONS,
            icon: <CollectionsIcon />,
        },
        {
            heading: t("managingEnquiryDarTitle"),
            link: RouteName.DATA_CUSTODIAN_MANAGING_ENQUIRY,
            icon: <DataAccessRequestIcon />,
        },
        {
            heading: t("theAllianceTitle"),
            link: RouteName.DATA_CUSTODIAN_THE_ALLIANCE,
            icon: <TheAllianceIcon />,
        },
    ];

    return (
        <>
            <Banner title={t("title")} />
            <Container sx={{ background: "white", p: 10 }}>
                <Grid
                    container
                    columnSpacing={6}
                    rowSpacing={6}
                    sx={{
                        svg: {
                            fontSize: "48px",
                        },
                    }}>
                    {data.map(({ heading, icon, link }) => (
                        <Grid
                            item
                            tablet={4}
                            mobile={6}
                            desktop={3}
                            sx={{ p: 0 }}
                            key={link}>
                            <FeatureCard
                                role="button"
                                icon={icon}
                                onClick={() => router.push(link)}>
                                <FeatureCardHeading>
                                    {heading}
                                </FeatureCardHeading>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 5 }}>
                    <ContactSupport />
                </Box>
            </Container>
        </>
    );
}
