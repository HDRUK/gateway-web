import {
    Tooltip as MuiTooltip,
    TooltipProps as MuiTooltipProps,
} from "@mui/material";
import { colors } from "@/config/theme";

interface TooltipProps extends MuiTooltipProps {
    variant?: string;
}
const Tooltip = ({ children, variant, ...rest }: TooltipProps) => {
    return (
        <MuiTooltip
            {...rest}
            {...(variant === "formTitle" && {
                componentsProps: {
                    tooltip: {
                        sx: {
                            bgcolor: "#dcdae1",
                            borderRadius: 0,
                            padding: "2px 5px",
                            color: colors.grey700,
                        },
                    },
                },
            })}>
            <span>{children}</span>
        </MuiTooltip>
    );
};

export default Tooltip;
