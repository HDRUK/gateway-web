"use client";

import { Box, Grid, SvgIconProps } from "@mui/material";
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
    TheAllianceIcon,
    ToolIcon,
} from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "@/app/[locale]/(logged-out)/support/components/ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.dataCustodianSupport";

const SVG_ICON_PROPS: Partial<SvgIconProps> = {
    fontSize: "xlarge",
};

export default function SupportCentreLinks() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);
    const router = useRouter();

    const data = [
        {
            heading: t("gettingStartedTitle"),
            link: RouteName.DATA_CUSTODIAN_GETTING_STARTED,
            icon: <DataCustodiansIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("metadataOnboardingTitle"),
            link: RouteName.DATA_CUSTODIAN_METADATA_ONBOARDING,
            icon: <MetadataOnboardingIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("uploadingDataUsesProjectsTitle"),
            link: RouteName.DATA_CUSTODIAN_UPLOADING_DATAUSES_PROJECTS,
            icon: <DataUseIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("onboardingCohortDiscoveryTitle"),
            link: RouteName.DATA_CUSTODIAN_COHORT_DISCOVERY,
            icon: <CohortDiscoveryIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("uploadingToolsTitle"),
            link: RouteName.DATA_CUSTODIAN_TOOLS,
            icon: <ToolIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("uploadingPublicationsTitle"),
            link: RouteName.DATA_CUSTODIAN_PUBLICATIONS,
            icon: <PublicationIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("managingCollectionsTitle"),
            link: RouteName.DATA_CUSTODIAN_MANAGING_COLLECTIONS,
            icon: <CollectionsIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("managingEnquiryDarTitle"),
            link: RouteName.DATA_CUSTODIAN_MANAGING_ENQUIRY,
            icon: <DataAccessRequestIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("theAllianceTitle"),
            link: RouteName.DATA_CUSTODIAN_THE_ALLIANCE,
            icon: <TheAllianceIcon {...SVG_ICON_PROPS} />,
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
