"use client";

import { useState } from "react";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import { colors } from "@/config/theme";
import { statusMapping, STEP_STATE } from "@/consts/cohortDiscovery";
import { RouteName } from "@/consts/routeName";
import { differenceInDays } from "@/utils/date";
import { capitalise } from "@/utils/general";
import { CircleState, StepNode, StepTitle } from "../Stepper";

const TRANSLATION_PATH = "pages.account.profile.cohortDiscovery.stepper";
const RESOLVED_STATUSES = ["APPROVED", "REJECTED", "EXPIRED", "BANNED"];

const INFO_HREF = `/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY}`;

interface CohortAccessStepperProps {
    autoOpen?: boolean;
}

const CohortAccessStepper = ({
    autoOpen = false,
}: CohortAccessStepperProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const tCd = useTranslations("pages.account.profile.cohortDiscovery");

    const { user, isLoading: userLoading } = useAuth();
    const {
        requestStatus,
        requestExpiry,
        isLoading: statusLoading,
        hasFetched,
    } = useCohortStatus(user?.id);

    const [expanded, setExpanded] = useState<boolean | null>(null);

    const started = expanded === null ? autoOpen && !requestStatus : expanded;

    const hasApplied = !!requestStatus;
    const isApproved = requestStatus === "APPROVED";
    const isResolved = RESOLVED_STATUSES.includes(requestStatus ?? "");
    const inReview = hasApplied && !isResolved;

    const step1State: CircleState = hasApplied
        ? STEP_STATE.COMPLETE
        : STEP_STATE.ACTIVE;
    const step2State: CircleState = isResolved
        ? STEP_STATE.COMPLETE
        : inReview
        ? STEP_STATE.ACTIVE
        : STEP_STATE.PENDING;
    const step3State: CircleState = isApproved
        ? STEP_STATE.COMPLETE
        : isResolved
        ? STEP_STATE.ACTIVE
        : STEP_STATE.PENDING;

    const daysRemaining =
        isApproved && requestExpiry
            ? differenceInDays(requestExpiry, new Date())
            : null;

    const loading = userLoading || statusLoading || !hasFetched;

    return (
        <Paper sx={{ bgcolor: "white", p: { mobile: 3, laptop: 4 } }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 3,
                }}>
                <Box>
                    <Typography variant="h2">{tCd("accessTitle")}</Typography>
                    <Typography color={colors.grey700}>
                        {t.rich("moreInfo", {
                            link: chunks => (
                                <Link href={INFO_HREF}>{chunks}</Link>
                            ),
                        })}
                    </Typography>
                    {!loading && hasApplied && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mt: 1,
                            }}>
                            <Chip
                                size="small"
                                label={capitalise(requestStatus)}
                                color={statusMapping[requestStatus]}
                            />
                            {isApproved && daysRemaining != null && (
                                <>
                                    <QueryBuilderIcon
                                        sx={{ color: colors.grey600 }}
                                    />
                                    <Typography sx={{ color: colors.grey600 }}>
                                        {daysRemaining} {tCd("daysRemaining")}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
                {!loading && isApproved && (
                    <CohortDiscoveryButton
                        label={t("accessButton")}
                        wrapperSx={{ width: "auto" }}
                    />
                )}
            </Box>

            {loading ? (
                <Loading />
            ) : isApproved ? null : (
                <>
                    <StepNode circleState={step1State} label="1">
                        <StepTitle>{t("applyStepTitle")}</StepTitle>
                        {step1State !== STEP_STATE.COMPLETE && (
                            <>
                                <Typography color={colors.grey600}>
                                    {t("applyStepDescription")}
                                </Typography>

                                {!started ? (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ mt: 2 }}
                                        onClick={() => setExpanded(true)}>
                                        {t("applyButton")}
                                    </Button>
                                ) : (
                                    <Box sx={{ mt: 3 }}>
                                        <StepNode
                                            circleState="active"
                                            label="1.1"
                                            small>
                                            <StepTitle small>
                                                {t("reviewProfileTitle")}
                                            </StepTitle>
                                        </StepNode>
                                        <StepNode
                                            circleState="locked"
                                            label="1.2"
                                            small
                                            isLast>
                                            <StepTitle small muted>
                                                {t("termsStepTitle")}
                                            </StepTitle>
                                        </StepNode>
                                    </Box>
                                )}
                            </>
                        )}
                    </StepNode>

                    <StepNode circleState={step2State} label="2">
                        <StepTitle>{t("reviewStepTitle")}</StepTitle>
                        {step2State !== STEP_STATE.COMPLETE && (
                            <Typography color={colors.grey600}>
                                {t("reviewStepDescription")}
                            </Typography>
                        )}
                    </StepNode>

                    <StepNode circleState={step3State} label="3" isLast>
                        <StepTitle>{t("decisionStepTitle")}</StepTitle>
                        {step3State !== STEP_STATE.COMPLETE && (
                            <Typography color={colors.grey600}>
                                {t("decisionStepDescription")}
                            </Typography>
                        )}
                    </StepNode>
                </>
            )}
        </Paper>
    );
};

export default CohortAccessStepper;
