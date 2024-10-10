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
    DataUseIcon,
    PublicationIcon,
    SearchIcon,
    ToolIcon,
} from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "../ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.support";

const SVG_ICON_PROPS: Partial<SvgIconProps> = {
    fontSize: "xlarge",
};

export default function SupportCentreLinks() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);
    const router = useRouter();

    const data = [
        {
            heading: t("searchTitle"),
            link: RouteName.HOW_TO_SEARCH,
            icon: <SearchIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("durTitle"),
            link: RouteName.SUPPORT_DUR,
            icon: <DataUseIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("cohortDiscoveryTitle"),
            link: RouteName.SUPPORT_COHORT_DISCOVERY,
            icon: <CohortDiscoveryIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("toolsTitle"),
            link: RouteName.SUPPORT_TOOLS,
            icon: <ToolIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("uploadingPublicationsTitle"),
            link: RouteName.SUPPORT_PUBLICATIONS,
            icon: <PublicationIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("exploringCollectionsTitle"),
            link: RouteName.SUPPORT_COLLECTIONS,
            icon: <CollectionsIcon {...SVG_ICON_PROPS} />,
        },
        {
            heading: t("darTitle"),
            link: RouteName.SUPPORT_DAR,
            icon: <DataAccessRequestIcon {...SVG_ICON_PROPS} />,
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
