"use client";

import { Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { templateRepeatFields } from "@/interfaces/Cms";
import Box from "@/components/Box";
import Container from "@/components/Container";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import { NHS_SDE_STATUS } from "@/consts/cohortDiscovery";
import CohortAccessPanel from "../CohortAccessPanel";
import CohortAccessStepper from "../CohortAccessStepper";
import NhsSdeAccessStepper from "../NhsSdeAccessStepper";

export default function CohortDiscoveryCoverPage({
    cmsContent,
}: {
    cmsContent: templateRepeatFields;
}) {
    const t = useTranslations("pages.account.profile.cohortDiscovery");

    const { user } = useAuth();
    const { hasAccess, nhseSdeRequestStatus } = useCohortStatus(user?.id);

    const bothApproved =
        hasAccess && nhseSdeRequestStatus === NHS_SDE_STATUS.APPROVED;

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
                <Grid
                    size={bothApproved ? { mobile: 12, laptop: 8 } : 12}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <CohortAccessStepper
                        cmsContent={cmsContent}
                        hideAccessButton={bothApproved}
                    />
                    <NhsSdeAccessStepper />
                </Grid>
                {bothApproved && (
                    <Grid size={{ mobile: 12, laptop: 4 }}>
                        <CohortAccessPanel />
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}
