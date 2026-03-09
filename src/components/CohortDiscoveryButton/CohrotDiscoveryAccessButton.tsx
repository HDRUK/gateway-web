import { CircularProgress, Tooltip } from "@mui/material";
import Button from "@/components/Button";
import { CohortDiscoveryButtonProps } from "./CohortDiscoveryButton";

interface CohortAccessButtonProps
    extends Omit<CohortDiscoveryButtonProps, "onRedirect"> {
    onClick: () => void;
    isLoading?: boolean;
    tooltip: string;
    label: string;
    testId: string;
    forceWhiteText?: boolean;
}

const CohortAccessButton = ({
    color,
    disabledOuter = false,
    onClick,
    isLoading = false,
    tooltip,
    label,
    testId,
    forceWhiteText = false,
    ...restProps
}: CohortAccessButtonProps) => {
    return (
        <Tooltip title={tooltip}>
            <span>
                <Button
                    onClick={onClick}
                    data-testid={testId}
                    color={color}
                    disabled={disabledOuter || isLoading}
                    sx={forceWhiteText ? { color: "white" } : undefined}
                    {...restProps}>
                    {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        label
                    )}
                </Button>
            </span>
        </Tooltip>
    );
};

export default CohortAccessButton;
