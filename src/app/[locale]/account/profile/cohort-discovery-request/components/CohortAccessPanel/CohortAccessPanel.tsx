"use client";

import { useTranslations } from "next-intl";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import Paper from "@/components/Paper";

const TRANSLATION_PATH = "pages.account.profile.cohortDiscovery.stepper";

const CohortAccessPanel = ({
    autoTriggerAccess = false,
}: {
    autoTriggerAccess?: boolean;
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Paper
            sx={{
                bgcolor: "white",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 3, md: 4 },
            }}>
            <CohortDiscoveryButton
                label={t("accessButton")}
                autoTriggerAccess={autoTriggerAccess}
            />
        </Paper>
    );
};

export default CohortAccessPanel;
