"use client";

import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { FeatureCard, FeatureCardHeading } from "@/components/FeatureCard";
import {
    CohortDiscoveryIcon,
    CollectionsIcon,
    DataAccessRequestIcon,
    DataUseIcon,
    PublicationIcon,
    ToolIcon,
} from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "../ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.support";

export default function MeetTheTeam() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);

    const data = [
        {
            heading: t("searchTitle"),
            link: RouteName.HOW_TO_SEARCH,
            icon: <SearchIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("durTitle"),
            link: RouteName.SUPPORT_DUR,
            icon: <DataUseIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("cohortDiscoveryTitle"),
            link: RouteName.SUPPORT_COHORT_DISCOVERY,
            icon: <CohortDiscoveryIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("toolsTitle"),
            link: RouteName.SUPPORT_TOOLS,
            icon: <ToolIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("uploadingPublicationsTitle"),
            link: RouteName.SUPPORT_PUBLICATIONS,
            icon: <PublicationIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("exploringCollectionsTitle"),
            link: RouteName.SUPPORT_COLLECTIONS,
            icon: <CollectionsIcon aria-hidden="true" focusable="false" />,
        },
        {
            heading: t("darTitle"),
            link: RouteName.SUPPORT_DAR,
            icon: (
                <DataAccessRequestIcon aria-hidden="true" focusable="false" />
            ),
        },
        {
            heading: t("researcherTitle"),
            link: RouteName.SUPPORT_RESEARCHER_FAQS,
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
                    sx={{ svg: { fontSize: "48px" } }}>
                    {data.map(({ heading, icon, link }) => (
                        <Grid
                            size={{
                                mobile: 6,
                                tablet: 4,
                                desktop: 3,
                            }}
                            sx={{ p: 0 }}
                            key={link}>
                            <FeatureCard icon={icon} href={link}>
                                <FeatureCardHeading
                                    sx={{ overflow: "hidden", pb: 1 }}>
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
