import { Control } from "react-hook-form";
import Box from "@/components/Box";
import Switch from "@/components/Switch";
import { SwitchProps } from "@/components/Switch/Switch";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

export interface SwitchInlineProps extends SwitchProps {
    extraInfo?: string;
    label?: string;
    control: Control;
    name: string;
}

const SwitchInline = (props: SwitchInlineProps) => {
    const { label, extraInfo, ...rest } = props;

    return (
        <Box sx={{ p: 0, mb: 1 }} alignItems="center" display="flex">
            <Box sx={{ p: 0, width: 50, mr: 2 }}>
                <Switch
                    {...rest}
                    size="medium"
                    checkedLabel=""
                    unCheckedLabel=""
                    formControlSx={{ mb: 0 }}
                />
            </Box>
            <Box sx={{ p: 0 }} flex={1}>
                {label && <Typography>{label}</Typography>}
                {extraInfo && (
                    <Typography sx={{ color: colors.grey500 }}>
                        {extraInfo}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default SwitchInline;
