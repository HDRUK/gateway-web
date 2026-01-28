import { useCallback, useState } from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useDialog from "@/hooks/useDialog";
import { CohortDiscoveryButtonProps } from "./CohortDiscoveryButton";

export const DATA_TEST_ID = "cohort-discovery-button";

const CohortDiscoveryServiceButton = ({
    ctaLink,
    color = undefined,
    disabledOuter = false,
    clickedAction,
    ...restProps
}: CohortDiscoveryButtonProps) => {
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { isLoggedIn, user, isLoading: isLoadingAuth } = useAuth();
    const { requestStatus, redirectUrl } = useCohortStatus(
        user?.id,
        true,
        false
    );

    const isDisabled =
        isLoggedIn && requestStatus
            ? !["APPROVED", "REJECTED", "EXPIRED"].includes(requestStatus)
            : false;

    const handleClick = useCallback(() => {
        if (disabledOuter || isDisabled || isLoadingAuth) return;
        setIsLoading(true);
        if (redirectUrl) {
            push(redirectUrl);
            return;
        }

        if (ctaLink) {
            push(ctaLink.url);
            return;
        }

        if (clickedAction) {
            clickedAction();
            setIsLoading(false);
            return;
        }

        showDialog(ProvidersDialog);
    }, [
        disabledOuter,
        isDisabled,
        isLoadingAuth,
        redirectUrl,
        ctaLink,
        clickedAction,
        push,
        showDialog,
    ]);

    return (
        <Tooltip title={"Access the new cohort discovery service"}>
            <span>
                <Button
                    onClick={handleClick}
                    data-testid={DATA_TEST_ID}
                    color={color ?? "primary"}
                    disabled={disabledOuter || isDisabled || !redirectUrl}
                    {...restProps}>
                    {isLoadingAuth || isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Cohort Discovery Service"
                    )}
                </Button>
            </span>
        </Tooltip>
    );
};

export default CohortDiscoveryServiceButton;
