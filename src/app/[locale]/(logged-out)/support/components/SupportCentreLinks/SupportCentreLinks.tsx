"use client";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { FeatureCard, FeatureCardHeading } from "@/components/FeatureCard";
import { SendIcon } from "@/consts/customIcons";
import { SchemaOutlinedIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "../ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.support";

export default function MeetTheTeam() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);
    const router = useRouter();

    const data = [
        {
            heading: t("searchTitle"),
            link: RouteName.HOW_TO_SEARCH,
            icon: <SearchIcon />,
        },
        {
            heading: t("durTitle"),
            link: RouteName.SUPPORT_DUR,
            icon: "[icon tbd]",
        },
        {
            heading: t("cohortDiscoveryTitle"),
            link: RouteName.SUPPORT_COHORT_DISCOVERY,
            icon: <SchemaOutlinedIcon />,
        },
        {
            heading: t("toolsTitle"),
            link: RouteName.SUPPORT_TOOLS,
            icon: <CloudUploadIcon />,
        },
        {
            heading: t("uploadingPublicationsTitle"),
            link: RouteName.SUPPORT_PUBLICATIONS,
            icon: "[icon tbd]",
        },
        {
            heading: t("exploringCollectionsTitle"),
            link: RouteName.SUPPORT_COLLECTIONS,
            icon: <PeopleIcon />,
        },
        {
            heading: t("darTitle"),
            link: RouteName.SUPPORT_DAR,
            icon: <SendIcon sx={{ fontSize: "3rem" }} />,
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
