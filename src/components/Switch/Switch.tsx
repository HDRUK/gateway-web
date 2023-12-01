/** @jsxImportSource @emotion/react */

import { Stack, Typography, FormControl, SxProps } from "@mui/material";
import MuiSwitch, { SwitchProps as MuiSwitchProps } from "@mui/material/Switch";
import { Control, useController } from "react-hook-form";
import Tooltip from "@/components/Tooltip";

export interface SwitchProps extends MuiSwitchProps {
    checkedLabel?: string;
    unCheckedLabel?: string;
    name: string;
    title?: string;
    disabled?: boolean;
    control: Control;
    switchSx?: SxProps;
    formControlSx?: SxProps;
}

const Switch = (props: SwitchProps) => {
    const {
        unCheckedLabel,
        checkedLabel,
        control,
        name,
        title,
        size = "large",
        disabled = false,
        formControlSx,
        switchSx,
        ...rest
    } = props;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <FormControl
            fullWidth
            sx={{ m: 0, mb: 2, ...formControlSx }}
            error={!!error}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography>{unCheckedLabel}</Typography>
                <Tooltip title={title} variant="formTitle">
                    <MuiSwitch
                        size={size}
                        disableRipple
                        {...rest}
                        {...fieldProps}
                        disabled={disabled}
                        checked={fieldProps.value}
                        inputRef={ref}
                        sx={{ ...switchSx }}
                    />
                </Tooltip>
                <Typography>{checkedLabel}</Typography>
            </Stack>
        </FormControl>
    );
};

export default Switch;
