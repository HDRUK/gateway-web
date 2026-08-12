"use client";

import { ReactNode, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { templateRepeatFields } from "@/interfaces/Cms";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import {
    COHORT_ABOUT_HREF,
    COHORT_REAPPLY_STATUSES,
    statusMapping,
    STEP_STATE,
} from "@/consts/cohortDiscovery";
import { differenceInDays } from "@/utils/date";
import { capitalise } from "@/utils/general";
import ProfileForm from "@/app/[locale]/account/profile/components/ProfileForm";
import CohortRequestTermsDialog from "../CohortRequestTermsDialog";
import CohortUserDeclaration from "../CohortUserDeclaration";
import { CircleState, StepNode, StepTitle } from "../Stepper";

const TRANSLATION_PATH = "pages.account.profile.cohortDiscovery.stepper";
const RESOLVED_STATUSES = ["APPROVED", "REJECTED", "EXPIRED", "BANNED"];

const TERMS_HREF =
    "https://digital.nhs.uk/data-and-information/research-powered-by-data/registration-service";

interface CohortAccessStepperProps {
    cmsContent: templateRepeatFields;
    autoOpen?: boolean;
    hideAccessButton?: boolean;
}

const CohortAccessStepper = ({
    cmsContent,
    autoOpen = false,
    hideAccessButton = false,
}: CohortAccessStepperProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const tCd = useTranslations("pages.account.profile.cohortDiscovery");

    const { user, isLoading: userLoading } = useAuth();
    const {
        requestStatus,
        requestExpiry,
        isLoading: statusLoading,
        hasFetched,
        refetch,
    } = useCohortStatus(user?.id);
    const { showDialog } = useDialog();

    const [expanded, setExpanded] = useState<boolean | null>(null);
    const [activeSubStep, setActiveSubStep] = useState(0);

    const hasApplied = !!requestStatus;
    const isApproved = requestStatus === "APPROVED";
    const isResolved = RESOLVED_STATUSES.includes(requestStatus ?? "");
    const inReview = hasApplied && !isResolved;
    const canReapply = COHORT_REAPPLY_STATUSES.includes(requestStatus ?? "");

    const started =
        expanded === null
            ? autoOpen && (!requestStatus || canReapply)
            : expanded;

    const step1State: CircleState =
        hasApplied && !canReapply ? STEP_STATE.COMPLETE : STEP_STATE.ACTIVE;
    const step2State: CircleState =
        isResolved && !canReapply
            ? STEP_STATE.COMPLETE
            : inReview
            ? STEP_STATE.ACTIVE
            : STEP_STATE.PENDING;
    const step3State: CircleState = isApproved
        ? STEP_STATE.COMPLETE
        : isResolved && !canReapply
        ? STEP_STATE.ACTIVE
        : STEP_STATE.PENDING;

    const daysRemaining =
        isApproved && requestExpiry
            ? differenceInDays(requestExpiry, new Date())
            : null;

    const openTerms = () =>
        showDialog(CohortRequestTermsDialog, {
            cmsContent,
            onSubmitted: refetch,
        });

    const cancelApplication = () => {
        setExpanded(false);
        setActiveSubStep(0);
    };

    const checklist: { key: string }[] = [
        { key: "checklistEmail" },
        { key: "checklistOrcid" },
        { key: "checklistSector" },
        { key: "checklistRole" },
    ];

    const richTags = {
        warn: (chunks: ReactNode) => (
            <Typography component="span" color={colors.red600}>
                {chunks}
            </Typography>
        ),
        note: (chunks: ReactNode) => (
            <Typography component="span" color={colors.grey600}>
                {chunks}
            </Typography>
        ),
        terms: (chunks: ReactNode) => (
            <Link href={TERMS_HREF} target="_blank" rel="noopener noreferrer">
                {chunks}
            </Link>
        ),
    };

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
                                <Link href={COHORT_ABOUT_HREF}>{chunks}</Link>
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
                {!loading && isApproved && !hideAccessButton && (
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
                                        {canReapply
                                            ? t("reapplyButton")
                                            : t("applyButton")}
                                    </Button>
                                ) : (
                                    <Box sx={{ mt: 3 }}>
                                        <StepNode
                                            circleState={
                                                activeSubStep >= 1
                                                    ? STEP_STATE.COMPLETE
                                                    : STEP_STATE.ACTIVE
                                            }
                                            label="1.1"
                                            small>
                                            <StepTitle small>
                                                {t("reviewProfileTitle")}
                                            </StepTitle>
                                            {activeSubStep === 0 && (
                                                <>
                                                    <Typography
                                                        sx={{ mt: 1, mb: 1 }}>
                                                        {t(
                                                            "reviewProfileIntro"
                                                        )}
                                                    </Typography>
                                                    <Box sx={{ mb: 2 }}>
                                                        {checklist.map(item => (
                                                            <Box
                                                                key={item.key}
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "flex-start",
                                                                    gap: 1,
                                                                    mb: 0.5,
                                                                }}>
                                                                <CheckCircleIcon
                                                                    sx={{
                                                                        color: colors.green400,
                                                                        fontSize: 20,
                                                                        mt: 0.25,
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                                <Typography component="div">
                                                                    {t.rich(
                                                                        item.key,
                                                                        richTags
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                    <ProfileForm
                                                        hideKeepingUpdated
                                                        submitLabel={t(
                                                            "profileContinueButton"
                                                        )}
                                                        onSaved={() =>
                                                            setActiveSubStep(1)
                                                        }
                                                    />
                                                </>
                                            )}
                                        </StepNode>
                                        <StepNode
                                            circleState={
                                                activeSubStep >= 1
                                                    ? STEP_STATE.ACTIVE
                                                    : STEP_STATE.LOCKED
                                            }
                                            label="1.2"
                                            small
                                            isLast>
                                            <StepTitle
                                                small
                                                muted={activeSubStep < 1}>
                                                {t("termsStepTitle")}
                                            </StepTitle>
                                            {activeSubStep >= 1 && (
                                                <Box sx={{ mt: 1 }}>
                                                    <CohortUserDeclaration
                                                        onSubmit={openTerms}
                                                        onCancel={
                                                            cancelApplication
                                                        }
                                                    />
                                                </Box>
                                            )}
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
