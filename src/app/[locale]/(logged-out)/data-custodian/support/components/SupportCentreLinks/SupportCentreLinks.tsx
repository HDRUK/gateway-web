"use client";

import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
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
    TheAllianceIcon,
    ToolIcon,
} from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "@/app/[locale]/(logged-out)/support/components/ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.dataCustodianSupport";

export default function MeetTheTeam() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);

    const data = [
        {
            heading: t("gettingStartedTitle"),
            link: RouteName.DATA_CUSTODIAN_GETTING_STARTED,
            icon: <DataCustodiansIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("metadataOnboardingTitle"),
            link: RouteName.DATA_CUSTODIAN_METADATA_ONBOARDING,
            icon: (
                <MetadataOnboardingIcon aria-hidden="true" focusable="false" />
            ),
        },
        {
            heading: t("uploadingDataUsesProjectsTitle"),
            link: RouteName.DATA_CUSTODIAN_UPLOADING_DATAUSES_PROJECTS,
            icon: <DataUseIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("onboardingCohortDiscoveryTitle"),
            link: RouteName.DATA_CUSTODIAN_COHORT_DISCOVERY,
            icon: <CohortDiscoveryIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("uploadingToolsTitle"),
            link: RouteName.DATA_CUSTODIAN_TOOLS,
            icon: <ToolIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("uploadingPublicationsTitle"),
            link: RouteName.DATA_CUSTODIAN_PUBLICATIONS,
            icon: <PublicationIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("managingCollectionsTitle"),
            link: RouteName.DATA_CUSTODIAN_MANAGING_COLLECTIONS,
            icon: <CollectionsIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("managingEnquiryDarTitle"),
            link: RouteName.DATA_CUSTODIAN_MANAGING_ENQUIRY,
            icon: (
                <DataAccessRequestIcon aria-hidden="true" focusable="false" />
            ),
        },
        {
            heading: t("theAllianceTitle"),
            link: RouteName.DATA_CUSTODIAN_THE_ALLIANCE,
            icon: <TheAllianceIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("faqsTitle"),
            link: RouteName.DATA_CUSTODIAN_FAQS,
            icon: <QuizOutlinedIcon aria-hidden="true" focusable="false" />,
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
                            size={{ mobile: 6, tablet: 4, desktop: 3 }}
                            sx={{ p: 0 }}
                            key={link}>
                            <FeatureCard icon={icon} href={link}>
                                <FeatureCardHeading sx={{ overflow: "hidden" }}>
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
