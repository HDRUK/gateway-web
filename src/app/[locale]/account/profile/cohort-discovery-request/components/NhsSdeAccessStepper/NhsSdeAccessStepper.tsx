"use client";

import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import { colors } from "@/config/theme";
import { STEP_STATE } from "@/consts/cohortDiscovery";
import { RouteName } from "@/consts/routeName";
import { useFeatures } from "@/providers/FeatureProvider";
import { CircleState, StepNode, StepTitle } from "../Stepper";

const TRANSLATION_PATH = "pages.account.profile.cohortDiscovery.nhsStepper";
const ABOUT_HREF = `/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY}`;
const MORE_INFO_HREF = `${ABOUT_HREF}?tab=nhs-sde-network`;

const NhsSdeAccessStepper = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const tCd = useTranslations("pages.account.profile.cohortDiscovery");

    const { user, isLoading: userLoading } = useAuth();
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const {
        requestStatus,
        isLoading: statusLoading,
        hasFetched,
    } = useCohortStatus(user?.id);

    const [applied, setApplied] = useState(false);

    const loading = userLoading || statusLoading || !hasFetched;
    const cdsApproved = requestStatus === "APPROVED";

    const steps: {
        label: string;
        state: CircleState;
        titleKey: string;
        muted: boolean;
        extra?: ReactNode;
    }[] = [
        {
            label: "1",
            state: cdsApproved ? STEP_STATE.COMPLETE : STEP_STATE.LOCKED,
            titleKey: "step1Title",
            muted: false,
            extra: cdsApproved
                ? applied
                    ? (
                          <Typography color={colors.grey600} sx={{ mt: 1 }}>
                              {t("appliedText")}
                          </Typography>
                      )
                    : (
                          <Button
                              variant="outlined"
                              color="secondary"
                              sx={{ mt: 1 }}
                              onClick={() => setApplied(true)}>
                              {t("applyButton")}
                          </Button>
                      )
                : undefined,
        },
        {
            label: "2",
            state: STEP_STATE.LOCKED,
            titleKey: "step2Title",
            muted: true,
        },
        {
            label: "3",
            state: STEP_STATE.LOCKED,
            titleKey: "step3Title",
            muted: true,
        },
        {
            label: "4",
            state: STEP_STATE.LOCKED,
            titleKey: "step4Title",
            muted: true,
        },
        {
            label: "5",
            state: STEP_STATE.LOCKED,
            titleKey: "step5Title",
            muted: true,
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
                    {steps.map((step, i) => (
                        <StepNode
                            key={step.label}
                            circleState={step.state}
                            label={step.label}
                            isLast={i === steps.length - 1}>
                            <StepTitle muted={step.muted}>
                                {t(step.titleKey)}
                            </StepTitle>
                            {step.extra}
                        </StepNode>
                    ))}
                </>
            )}
        </Paper>
    );
};

export default NhsSdeAccessStepper;
