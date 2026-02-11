"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import IndicateNhseSdeAccessButton from "@/components/IndicateNhseSdeAccessButton";
import RequestNhseSdeAccessButton from "@/components/RequestNhseSdeAccessButton";
import Typography from "@/components/Typography";
import { useFeatures } from "@/providers/FeatureProvider";

const TRANSLATION_PATH = "components.CohortDiscoveryInfo";

const CohortAccessButtons = () => {
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <>
            <Box sx={{ p: 0 }}>
                {isNhsSdeApplicationsEnabled && (
                    <Typography sx={{ py: 1 }}>{t("step1")}</Typography>
                )}
                <RequestNhseSdeAccessButton />
            </Box>
            <Box sx={{ p: 0 }}>
                {isNhsSdeApplicationsEnabled && (
                    <Typography sx={{ py: 1 }}>{t("step2")}</Typography>
                )}
                <IndicateNhseSdeAccessButton />
            </Box>
        </>
    );
};

export default CohortAccessButtons;
