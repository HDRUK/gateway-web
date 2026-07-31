"use client";

import { useState } from "react";
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

    const step1State: CircleState = cdsApproved
        ? STEP_STATE.COMPLETE
        : STEP_STATE.LOCKED;
    const step2State: CircleState = STEP_STATE.LOCKED;
    const step3State: CircleState = STEP_STATE.LOCKED;
    const step4State: CircleState = STEP_STATE.LOCKED;
    const step5State: CircleState = STEP_STATE.LOCKED;

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
                    <StepNode circleState={step1State} label="1">
                        <StepTitle>{t("step1Title")}</StepTitle>
                        {cdsApproved && !applied && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ mt: 1 }}
                                onClick={() => setApplied(true)}>
                                {t("applyButton")}
                            </Button>
                        )}
                        {cdsApproved && applied && (
                            <Typography color={colors.grey600} sx={{ mt: 1 }}>
                                {t("appliedText")}
                            </Typography>
                        )}
                    </StepNode>

                    <StepNode circleState={step2State} label="2">
                        <StepTitle muted>{t("step2Title")}</StepTitle>
                    </StepNode>

                    <StepNode circleState={step3State} label="3">
                        <StepTitle muted>{t("step3Title")}</StepTitle>
                    </StepNode>

                    <StepNode circleState={step4State} label="4">
                        <StepTitle muted>{t("step4Title")}</StepTitle>
                    </StepNode>

                    <StepNode circleState={step5State} label="5" isLast>
                        <StepTitle muted>{t("step5Title")}</StepTitle>
                    </StepNode>
                </>
            )}
        </Paper>
    );
};

export default NhsSdeAccessStepper;
