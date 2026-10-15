import { Tooltip } from "@mui/material";
import { Button } from "@hdruk/ui";
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

const CohortDiscoveryAccessButton = ({
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
                    loading={isLoading}
                    disabled={disabledOuter}
                    sx={forceWhiteText ? { color: "white" } : undefined}
                    {...restProps}>
                    {label}
                </Button>
            </span>
        </Tooltip>
    );
};

export default CohortDiscoveryAccessButton;
