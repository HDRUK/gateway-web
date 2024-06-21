"use client";

import { Person } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import {
    FeatureCard,
    FeatureCardBody,
    FeatureCardHeading,
} from "@/components/FeatureCard";
import ContactSupport from "../ContactSupport";

const data = [
    {
        heading: "Heading 1",
        body: "Body 1",
        icon: <Person />,
    },
    {
        heading: "Heading 2",
        body: "Body 1",
        icon: <Person />,
    },
    {
        heading: "Heading 3",
        body: "Body 1",
        icon: <Person />,
    },
    {
        heading: "Heading 4",
        body: "Body 1",
        icon: <Person />,
    },
    {
        heading: "Heading 5",
        body: "Body 1",
        icon: <Person />,
    },
    {
        heading: "Heading 6",
        body: "Body 1",
        icon: <Person />,
    },
];

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.support";

export default function MeetTheTeam() {
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);

    return (
        <>
            <Banner title={t("title")} />
            <Container sx={{ background: "white", p: 10 }}>
                <Grid container columnSpacing={3} rowSpacing={6}>
                    {data.map(({ heading, body, icon }) => (
                        <Grid
                            item
                            tablet={4}
                            mobile={6}
                            desktop={3}
                            sx={{ p: 0 }}>
                            <FeatureCard icon={icon}>
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
