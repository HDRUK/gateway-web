/** @jsxImportSource @emotion/react */

import { Stack, Typography, FormControl, SxProps } from "@mui/material";
import MuiSwitch, { SwitchProps } from "@mui/material/Switch";
import { Control, useController } from "react-hook-form";

export interface toggleButtonProps extends SwitchProps {
    checkedLabel: string;
    unCheckedLabel: string;
    name: string;
    control: Control;
    switchSx?: SxProps;
    formControlSx?: SxProps;
}

const Switch = (props: toggleButtonProps) => {
    const {
        unCheckedLabel,
        checkedLabel,
        control,
        name,
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
                <MuiSwitch
                    disableRipple
                    {...rest}
                    {...fieldProps}
                    inputRef={ref}
                    sx={{ ...switchSx }}
                />
                <Typography>{checkedLabel}</Typography>
            </Stack>
        </FormControl>
    );
};
Switch.defaultProps = {
    switchSx: {},
    formControlSx: {},
};

export default Switch;
