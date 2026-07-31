"use client";

import { ReactNode, useState } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import IndicateNhseSdeAccessButton from "@/components/IndicateNhseSdeAccessButton";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import RequestNhseSdeAccessButton from "@/components/RequestNhseSdeAccessButton";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useModal from "@/hooks/useModal";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import {
    COHORT_STATUS,
    NHS_SDE_NEGATIVE_STATUSES,
    NHS_SDE_STATUS,
    STEP_STATE,
} from "@/consts/cohortDiscovery";
import { RouteName } from "@/consts/routeName";
import { capitalise } from "@/utils/general";
import { revalidateCacheAction } from "@/app/actions/revalidateCacheAction";
import { useFeatures } from "@/providers/FeatureProvider";
import { CircleState, StepNode, StepTitle } from "../Stepper";

const TRANSLATION_PATH = "pages.account.profile.cohortDiscovery.nhsStepper";
const ABOUT_HREF = `/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY}`;
const MORE_INFO_HREF = `${ABOUT_HREF}?tab=nhs-sde-network`;
const HOW_TO_HREF = `${ABOUT_HREF}?tab=how-to-request-access`;
const REGISTRATION_INFO_URL =
    "https://digital.nhs.uk/data-and-information/research-powered-by-data/sde-network";

const NhsSdeAccessStepper = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const tCd = useTranslations("pages.account.profile.cohortDiscovery");

    const { user, isLoading: userLoading } = useAuth();
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const {
        requestStatus,
        nhseSdeRequestStatus,
        isLoading: statusLoading,
        hasFetched,
        refetch,
    } = useCohortStatus(user?.id);
    const { showModal } = useModal();

    const [applied, setApplied] = useState(false);
    const [formCompleted, setFormCompleted] = useState(false);

    const indicateUrl = `${apis.cohortRequestsV1Url}/user/${user?.id}/indicate_nhse_access`;
    const submitIndicate = usePost(indicateUrl, {
        successNotificationsOn: false,
    });

    const loading = userLoading || statusLoading || !hasFetched;

    const cdsApproved = requestStatus === COHORT_STATUS.APPROVED;
    const nhs = nhseSdeRequestStatus;
    const isApproved = nhs === NHS_SDE_STATUS.APPROVED;
    const inProcess = nhs === NHS_SDE_STATUS.IN_PROCESS;
    const approvalRequested = nhs === NHS_SDE_STATUS.APPROVAL_REQUESTED;
    const isResolvedNeg =
        !!nhs && (NHS_SDE_NEGATIVE_STATUSES as string[]).includes(nhs);

    const activeStep = (() => {
        if (!cdsApproved) return 1;
        switch (nhs) {
            case NHS_SDE_STATUS.APPROVED:
                return 6;
            case NHS_SDE_STATUS.REJECTED:
            case NHS_SDE_STATUS.EXPIRED:
            case NHS_SDE_STATUS.BANNED:
            case NHS_SDE_STATUS.SUSPENDED:
                return 5;
            case NHS_SDE_STATUS.APPROVAL_REQUESTED:
                return 4;
            case NHS_SDE_STATUS.IN_PROCESS:
                return formCompleted ? 3 : 2;
            default:
                return applied ? 2 : 1;
        }
    })();

    const circleFor = (index: number): CircleState => {
        if (index === 1) {
            return cdsApproved ? STEP_STATE.COMPLETE : STEP_STATE.LOCKED;
        }
        if (index < activeStep) return STEP_STATE.COMPLETE;
        if (index === activeStep) return STEP_STATE.ACTIVE;
        return STEP_STATE.PENDING;
    };

    const badge = !cdsApproved
        ? null
        : approvalRequested
        ? { label: t("badgePending"), bg: colors.grey600 }
        : inProcess || (applied && !nhs)
        ? { label: t("badgeAwaitingAction"), bg: colors.orange }
        : isApproved
        ? { label: capitalise(nhs), bg: colors.green400 }
        : isResolvedNeg
        ? { label: capitalise(nhs), bg: colors.red700 }
        : null;

    const openConfirmModal = () => {
        showModal({
            title: t("modalTitle"),
            content: <Typography>{t("modalBody")}</Typography>,
            showCancel: true,
            showConfirm: true,
            cancelText: t("modalCancel"),
            confirmText: t("modalConfirm"),
            onSuccess: async () => {
                const result = await submitIndicate({});
                if (result) {
                    revalidateCacheAction(`cohort-user-${user?.id}`);
                    refetch();
                }
            },
        });
    };

    const steps: {
        titleKey: string;
        extra?: (state: CircleState) => ReactNode;
    }[] = [
        {
            titleKey: "step1Title",
            extra: () => (
                <>
                    {!cdsApproved && (
                        <Typography
                            component="div"
                            color={colors.grey600}
                            sx={{ whiteSpace: "pre-line" }}>
                            {t.rich("step1Text", {
                                link: chunks => (
                                    <Link href={HOW_TO_HREF}>{chunks}</Link>
                                ),
                            })}
                        </Typography>
                    )}
                    {cdsApproved && !nhs && !applied && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ mt: 1 }}
                            onClick={() => setApplied(true)}>
                            {t("applyButton")}
                        </Button>
                    )}
                </>
            ),
        },
        {
            titleKey: "step2Title",
            extra: state => state === STEP_STATE.ACTIVE && (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 1,
                            mb: 2,
                            flexWrap: "wrap",
                        }}>
                        <RequestNhseSdeAccessButton
                            variant="outlined"
                            color="secondary"
                            label={t("openFormButton")}
                            refetchCohort={refetch}
                        />
                        {inProcess && (
                            <Button
                                color="greyCustom"
                                onClick={() => setFormCompleted(true)}>
                                {t("confirmFormButton")}
                            </Button>
                        )}
                    </Box>
                    <Typography component="div" color={colors.grey600}>
                        {t.rich("step2Text", {
                            link: chunks => (
                                <Link
                                    href={REGISTRATION_INFO_URL}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                        }}>
                        <WarningAmberIcon
                            sx={{ color: colors.red700, fontSize: 18 }}
                        />
                        <Typography color={colors.red700}>
                            {t("step2Warning")}
                        </Typography>
                    </Box>
                </>
            ),
        },
        {
            titleKey: "step3Title",
            extra: state => state === STEP_STATE.ACTIVE && (
                <>
                    <Typography color={colors.grey600} sx={{ mt: 1, mb: 2 }}>
                        {t("step3Text")}
                    </Typography>
                    <IndicateNhseSdeAccessButton
                        label={t("indicateButton")}
                        action={openConfirmModal}
                    />
                </>
            ),
        },
        {
            titleKey: "step4Title",
        },
        {
            titleKey: "step5Title",
        },
    ];

    return (
        <Paper sx={{ bgcolor: "white", p: { mobile: 3, laptop: 4 } }}>
            <Typography variant="h2">{t("title")}</Typography>
            <Typography sx={{ mb: 2 }} color={colors.grey700}>
                {t.rich("moreInfo", {
                    link: chunks => <Link href={MORE_INFO_HREF}>{chunks}</Link>,
                })}
            </Typography>

            {loading ? (
                <Loading />
            ) : !isNhsSdeApplicationsEnabled ? (
                <Typography component="div" color={colors.grey600}>
                    {tCd.rich("nhseSdeTemporaryText", {
                        mailto: chunks => (
                            <Link href={`mailto:${chunks}`}>{chunks}</Link>
                        ),
                    })}
                </Typography>
            ) : (
                <>
                    {badge && (
                        <Box sx={{ mb: 3 }}>
                            <Chip
                                size="small"
                                label={badge.label}
                                sx={{ bgcolor: badge.bg, color: colors.white }}
                            />
                        </Box>
                    )}

                    {steps.map((step, i) => {
                        const label = `${i + 1}`;
                        const state = circleFor(i + 1);
                        return (
                            <StepNode
                                key={label}
                                circleState={state}
                                label={label}
                                isLast={i === steps.length - 1}>
                                <StepTitle
                                    muted={state === STEP_STATE.PENDING}>
                                    {t(step.titleKey)}
                                </StepTitle>
                                {step.extra && step.extra(state)}
                            </StepNode>
                        );
                    })}
                </>
            )}
        </Paper>
    );
};

export default NhsSdeAccessStepper;
