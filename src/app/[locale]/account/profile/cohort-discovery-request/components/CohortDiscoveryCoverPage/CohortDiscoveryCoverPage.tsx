"use client";

import { ReactElement } from "react";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Grid, Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import Container from "@/components/Container";
import IndicateNhseSdeAccessButton from "@/components/IndicateNhseSdeAccessButton";
import Paper from "@/components/Paper";
import RequestNhseSdeAccessButton from "@/components/RequestNhseSdeAccessButton";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import { colors } from "@/config/theme";
import { statusMapping } from "@/consts/cohortDiscovery";
import { differenceInDays } from "@/utils/date";
import { capitalise } from "@/utils/general";
import { useFeatures } from "@/providers/FeatureProvider";

export default function CohortDiscoveryCoverPage({
    ctaOverrideComponent,
}: {
    ctaOverrideComponent?: ReactElement;
}) {
    const t = useTranslations("pages.account.profile.cohortDiscovery");
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const { user } = useAuth();
    const { requestExpiry, requestStatus } = useCohortStatus(user?.id);

    const daysRemaining =
        requestStatus === "APPROVED" && requestExpiry
            ? // eslint-disable-next-line react-hooks/purity
              differenceInDays(requestExpiry, Date.now())
            : null;

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
                <Grid size={{ mobile: 12, laptop: 8 }}>
                    <Paper
                        sx={{
                            bgcolor: "white",
                            px: { mobile: 3, laptop: 8 },
                            py: { mobile: 2, laptop: 6 },
                        }}>
                        <Typography variant="h1">{t("accessTitle")}</Typography>
                        <Box sx={{ display: "flex", px: 0, pt: 0, gap: 2 }}>
                            {requestStatus && (
                                <>
                                    <Chip
                                        size="small"
                                        label={capitalise(requestStatus)}
                                        color={statusMapping[requestStatus]}
                                        sx={{ color: "white" }}
                                    />

                                    {requestStatus === "APPROVED" && (
                                        <>
                                            <QueryBuilderIcon
                                                sx={{ color: colors.grey600 }}
                                            />
                                            <Typography
                                                sx={{
                                                    color: colors.grey600,
                                                    alignContent: "center",
                                                }}>
                                                {daysRemaining}{" "}
                                                {t("daysRemaining")}
                                            </Typography>
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
                        <Typography color={colors.grey600} sx={{ pb: 2 }}>
                            {t("accessText1")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ mobile: 12, laptop: 4 }}>
                    <Paper
                        sx={{
                            bgcolor: "white",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        {ctaOverrideComponent}
                    </Paper>
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
                        {isNhsSdeApplicationsEnabled && (
                            <>
                                <Typography
                                    color={colors.red700}
                                    sx={{ pb: 2 }}>
                                    {t("nhseSdeText1")}
                                </Typography>
                                <Typography
                                    color={colors.grey600}
                                    sx={{ pb: 2 }}>
                                    {t("nhseSdeText2")}
                                </Typography>
                                <Typography color={colors.red700}>
                                    {t("nhseSdeText3")}
                                </Typography>
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
                            py: 2,
                        }}>
                        <RequestNhseSdeAccessButton sx={{ width: "90%" }} />
                        <IndicateNhseSdeAccessButton sx={{ width: "90%" }} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
