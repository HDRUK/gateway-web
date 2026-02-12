"use client";

import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Grid, Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import Container from "@/components/Container";
import IndicateNhseSdeAccessButton from "@/components/IndicateNhseSdeAccessButton";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Paper from "@/components/Paper";
import RequestNhseSdeAccessButton from "@/components/RequestNhseSdeAccessButton";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import { colors } from "@/config/theme";
import { NHSSDEStatusMapping, statusMapping } from "@/consts/cohortDiscovery";
import { RouteName } from "@/consts/routeName";
import { differenceInDays } from "@/utils/date";
import { capitalise } from "@/utils/general";
import { useFeatures } from "@/providers/FeatureProvider";

export default function CohortDiscoveryCoverPage() {
    const t = useTranslations("pages.account.profile.cohortDiscovery");
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const { user, isLoading: loadingUser } = useAuth();
    const { requestExpiry, requestStatus, nhseSdeRequestStatus, isLoading } =
        useCohortStatus(user?.id);

    const daysRemaining =
        requestStatus === "APPROVED" && requestExpiry
            ? // eslint-disable-next-line react-hooks/purity
              differenceInDays(requestExpiry, Date.now())
            : null;

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
                        <Typography color={colors.grey700} sx={{ pb: 2 }}>
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
                            p: 2,
                        }}>
                        <CohortDiscoveryButton
                            color="greyCustom"
                            hrefOverride={`/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_REGISTER}`}
                            wrapperSx={{ width: "100%" }}
                        />
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
                                {!loading &&
                                    nhseSdeRequestStatus !== "APPROVED" && (
                                        <MarkDownSanitizedWithHtml
                                            sx={{ color: colors.red700 }}
                                            content={t("nhseSdeText2")}
                                        />
                                    )}
                            </>
                        )}
                        {!isNhsSdeApplicationsEnabled && !loading && (
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
                                {!nhseSdeRequestStatus && (
                                    <RequestNhseSdeAccessButton color="greyCustom" />
                                )}
                                <IndicateNhseSdeAccessButton
                                    sx={{ width: "100%" }}
                                />
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
