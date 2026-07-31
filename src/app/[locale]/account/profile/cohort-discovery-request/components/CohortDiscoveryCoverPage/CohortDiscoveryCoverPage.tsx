"use client";

import { useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { templateRepeatFields } from "@/interfaces/Cms";
import Box from "@/components/Box";
import Container from "@/components/Container";
import CohortAccessStepper from "../CohortAccessStepper";
import NhsSdeAccessStepper from "../NhsSdeAccessStepper";

export default function CohortDiscoveryCoverPage({
    cmsContent,
}: {
    cmsContent: templateRepeatFields;
}) {
    const t = useTranslations("pages.account.profile.cohortDiscovery");

    const searchParams = useSearchParams();

    const autoOpen = useMemo(() => {
        return searchParams?.get("open") === "true";
    }, [searchParams]);

    return (
        <Container sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ bgcolor: "white", mb: 3, px: 4, pb: 1, pt: 3 }}>
                <Typography variant="h2">{t("title")}</Typography>
                <Typography>{t("headerText")}</Typography>
            </Box>
            <Grid
                container
                spacing={2}
                columnSpacing={2}
                direction="row"
                alignItems="stretch">
                <Grid size={12}>
                    <CohortAccessStepper
                        cmsContent={cmsContent}
                        autoOpen={autoOpen}
                    />
                </Grid>
                <Grid size={12}>
                    <NhsSdeAccessStepper />
                </Grid>
            </Grid>
        </Container>
    );
}
