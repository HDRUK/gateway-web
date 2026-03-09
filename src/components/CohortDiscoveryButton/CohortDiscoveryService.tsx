import { CircularProgress, Tooltip } from "@mui/material";
import Button from "@/components/Button";
import { CohortDiscoveryButtonProps } from "./CohortDiscoveryButton";

export const DATA_TEST_ID = "new-cohort-discovery-button";

interface CohortDiscoveryServiceButtonProps
    extends Omit<CohortDiscoveryButtonProps, "onRedirect"> {
    onClick: () => void;
    isLoading?: boolean;
}

const CohortDiscoveryServiceButton = ({
    color = "secondary",
    disabledOuter = false,
    onClick,
    isLoading = false,
    ...restProps
}: CohortDiscoveryServiceButtonProps) => {
    return (
        <Tooltip title="Access the new cohort discovery service">
            <span>
                <Button
                    onClick={onClick}
                    data-testid={DATA_TEST_ID}
                    color={color}
                    disabled={disabledOuter || isLoading}
                    sx={{ color: "white" }}
                    {...restProps}>
                    {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Access Cohort Discovery Service (Beta) "
                    )}
                </Button>
            </span>
        </Tooltip>
    );
};

export default CohortDiscoveryServiceButton;
