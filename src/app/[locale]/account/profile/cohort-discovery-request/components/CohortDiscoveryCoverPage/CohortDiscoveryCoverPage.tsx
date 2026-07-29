"use client";

import { useMemo } from "react";
import { Grid, Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import Container from "@/components/Container";
import IndicateNhseSdeAccessButton from "@/components/IndicateNhseSdeAccessButton";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import RequestNhseSdeAccessButton from "@/components/RequestNhseSdeAccessButton";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import { colors } from "@/config/theme";
import { NHSSDEStatusMapping } from "@/consts/cohortDiscovery";
import { capitalise } from "@/utils/general";
import { useFeatures } from "@/providers/FeatureProvider";
import CohortAccessStepper from "../CohortAccessStepper";

export default function CohortDiscoveryCoverPage() {
    const t = useTranslations("pages.account.profile.cohortDiscovery");
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const { user, isLoading: loadingUser } = useAuth();
    const { nhseSdeRequestStatus, isLoading, refetch } = useCohortStatus(
        user?.id
    );

    const searchParams = useSearchParams();

    const autoOpen = useMemo(() => {
        return searchParams?.get("open") === "true";
    }, [searchParams]);

    const loading = loadingUser || isLoading;

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
                    <CohortAccessStepper autoOpen={autoOpen} />
                </Grid>
                <Grid size={{ mobile: 12, laptop: 8 }}>
                    <Paper
                        sx={{
                            bgcolor: "white",
                            px: { mobile: 3, laptop: 8 },
                            py: { mobile: 2, laptop: 6 },
                        }}>
                        <Typography variant="h1">
                            {t("nhseSdeTitle")}
                        </Typography>
                        <Box sx={{ display: "flex", px: 0, pt: 0, gap: 2 }}>
                            {nhseSdeRequestStatus && (
                                <>
                                    <Chip
                                        size="small"
                                        label={capitalise(nhseSdeRequestStatus)}
                                        color={
                                            NHSSDEStatusMapping[
                                                nhseSdeRequestStatus
                                            ]
                                        }
                                    />

                                    {nhseSdeRequestStatus === "APPROVED" && (
                                        <>
                                            <Typography
                                                sx={{
                                                    color: colors.grey600,
                                                    alignContent: "center",
                                                }}>
                                                {t("nhsExpiry")}
                                            </Typography>
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
                        {isNhsSdeApplicationsEnabled && (
                            <>
                                <Typography
                                    color={colors.grey700}
                                    sx={{ pb: 2 }}>
                                    {t("nhseSdeText1")}
                                </Typography>
                                {!loading && !nhseSdeRequestStatus && (
                                    <MarkDownSanitizedWithHtml
                                        sx={{ color: colors.red700 }}
                                        content={t("nhseSdeText2")}
                                    />
                                )}
                            </>
                        )}
                        {!isNhsSdeApplicationsEnabled && (
                            <Typography color={colors.grey600}>
                                {t.rich("nhseSdeTemporaryText", {
                                    mailto: chunks => (
                                        <Link href={`mailto:${chunks}`}>
                                            {chunks}
                                        </Link>
                                    ),
                                })}
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ mobile: 12, laptop: 4 }}>
                    <Paper
                        sx={{
                            bgcolor: "white",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                            gap: 2,
                            p: 2,
                        }}>
                        {!loading && nhseSdeRequestStatus !== "APPROVED" && (
                            <>
                                <RequestNhseSdeAccessButton
                                    color="greyCustom"
                                    refetchCohort={refetch}
                                />
                                <IndicateNhseSdeAccessButton
                                    sx={{ width: "100%" }}
                                    refetchCohort={refetch}
                                />
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
