"use client";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { FeatureCard, FeatureCardHeading } from "@/components/FeatureCard";
import { SendIcon, TeamIcon } from "@/consts/customIcons";
import { SchemaOutlinedIcon } from "@/consts/icons";
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
            icon: <TeamIcon sx={{ fontSize: "3rem" }} />,
        },
        {
            heading: t("metadataOnboardingTitle"),
            link: RouteName.DATA_CUSTODIAN_METADATA_ONBOARDING,
            icon: "[icon tbd]",
        },
        {
            heading: t("uploadingDataUsesProjectsTitle"),
            link: RouteName.DATA_CUSTODIAN_UPLOADING_DATAUSES_PROJECTS,
            icon: "[icon tbd]",
        },
        {
            heading: t("onboardingCohortDiscoveryTitle"),
            link: RouteName.DATA_CUSTODIAN_COHORT_DISCOVERY,
            icon: <SchemaOutlinedIcon />,
        },
        {
            heading: t("uploadingToolsTitle"),
            link: RouteName.DATA_CUSTODIAN_TOOLS,
            icon: <CloudUploadIcon />,
        },
        {
            heading: t("uploadingPublicationsTitle"),
            link: RouteName.DATA_CUSTODIAN_PUBLICATIONS,
            icon: "[icon tbd]",
        },
        {
            heading: t("managingCollectionsTitle"),
            link: RouteName.DATA_CUSTODIAN_MANAGING_COLLECTIONS,
            icon: <PeopleIcon />,
        },
        {
            heading: t("managingEnquiryDarTitle"),
            link: RouteName.DATA_CUSTODIAN_MANAGING_ENQUIRY,
            icon: <SendIcon sx={{ fontSize: "48px" }} />,
        },
        {
            heading: t("theAllianceTitle"),
            link: RouteName.DATA_CUSTODIAN_THE_ALLIANCE,
            icon: "[icon tbd]",
        },
    ];

    return (
        <>
            <Banner title={t("title")} />
            <Container sx={{ background: "white", p: 10 }}>
                <Grid container columnSpacing={6} rowSpacing={6}>
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
