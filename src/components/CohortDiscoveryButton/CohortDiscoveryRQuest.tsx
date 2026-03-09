import { CircularProgress, Tooltip } from "@mui/material";
import Button from "@/components/Button";
import { CohortDiscoveryButtonProps } from "./CohortDiscoveryButton";

export const DATA_TEST_ID = "rquest-cohort-discovery-button";

interface CohortDiscoveryRQuestButtonProps
    extends Omit<CohortDiscoveryButtonProps, "onRedirect"> {
    onClick: () => void;
    isLoading?: boolean;
}

const CohortDiscoveryRQuestButton = ({
    color,
    tooltipOverride = "",
    disabledOuter = false,
    onClick,
    isLoading = false,
    ...restProps
}: CohortDiscoveryRQuestButtonProps) => {
    return (
        <Tooltip title={tooltipOverride || "Access RQuest"}>
            <span>
                <Button
                    onClick={onClick}
                    data-testid={DATA_TEST_ID}
                    color={color}
                    disabled={disabledOuter || isLoading}
                    {...restProps}>
                    {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Access RQuest"
                    )}
                </Button>
            </span>
        </Tooltip>
    );
};

export default CohortDiscoveryRQuestButton;
