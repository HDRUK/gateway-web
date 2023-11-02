import { colors } from "@/config/theme";
import {
    Tooltip as MuiTooltip,
    TooltipProps as MuiTooltipProps,
} from "@mui/material";

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
            <div>{children}</div>
        </MuiTooltip>
    );
};

export default Tooltip;
