"use client";

import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { templateRepeatFields } from "@/interfaces/Cms";
import Box from "@/components/Box";
import Container from "@/components/Container";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import usePostLoginAction from "@/hooks/usePostLoginAction";
import { NHS_SDE_STATUS } from "@/consts/cohortDiscovery";
import { PostLoginActions } from "@/consts/postLoginActions";
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

    const [pendingCdsOpen, setPendingCdsOpen] = useState(false);

    usePostLoginAction({
        onAction: ({ action }) => {
            if (action === PostLoginActions.OPEN_COHORT_DISCOVERY) {
                setPendingCdsOpen(true);
            }
        },
    });

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
                    size={bothApproved ? { xs: 12, md: 8 } : 12}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <CohortAccessStepper
                        cmsContent={cmsContent}
                        hideAccessButton={bothApproved}
                        autoTriggerAccess={pendingCdsOpen}
                    />
                    <NhsSdeAccessStepper />
                </Grid>
                {bothApproved && (
                    <Grid size={{ xs: 12, md: 4 }}>
                        <CohortAccessPanel autoTriggerAccess={pendingCdsOpen} />
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}
