"use client";

import { useRouter } from "next/navigation";
import { CtaLink } from "@/interfaces/Cms";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import { getPermissions } from "@/utils/permissions";

export const DATA_TEST_ID = "cta-override-button";
const COHORT_DISCOVERY_PERMISSION = "GENERAL_ACCESS";
const COHORT_DISCOVERY_URL = "https://rquest.prod.healthdatagateway.org/";

const CtaOverride = ({ ctaLink }: { ctaLink: CtaLink }) => {
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const { isLoggedIn, user } = useAuth();
    const permissions = getPermissions(user?.roles);

    const handleCtaClick = () => {
        if (permissions[COHORT_DISCOVERY_PERMISSION]) {
            push(COHORT_DISCOVERY_URL);
        } else if (isLoggedIn) {
            push(ctaLink.url);
        } else {
            showDialog(ProvidersDialog, { isProvidersDialog: true });
        }
    };

    return (
        <Button
            sx={{ mt: 3 }}
            onClick={handleCtaClick}
            data-testid={DATA_TEST_ID}>
            {ctaLink.title}
        </Button>
    );
};

export default CtaOverride;
