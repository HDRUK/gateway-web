"use client";

import { useRouter } from "next/navigation";
import { CtaLink } from "@/interfaces/Cms";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";

export const DATA_TEST_ID = "cta-override-button";

const CtaOverride = ({ ctaLink }: { ctaLink: CtaLink }) => {
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const { isLoggedIn } = useAuth();

    const handleCtaClick = () => {
        if (isLoggedIn) {
            push(ctaLink.url);
        } else {
            showDialog(ProvidersDialog);
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
