import { Tooltip as MuiTooltip, TooltipProps } from "@mui/material";

const Tooltip = ({ children, ...rest }: TooltipProps) => {
    return (
        <MuiTooltip {...rest}>
            <div>{children}</div>
        </MuiTooltip>
    );
};

export default Tooltip;
