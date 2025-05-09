/** @jsxImportSource @emotion/react */
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
    Stack,
    Typography,
    FormControl,
    SxProps,
    Tooltip,
} from "@mui/material";
import MuiSwitch, { SwitchProps as MuiSwitchProps } from "@mui/material/Switch";

export interface SwitchProps<TFieldValues extends FieldValues, TName>
    extends Omit<MuiSwitchProps, "name"> {
    checkedLabel?: string;
    unCheckedLabel?: string;
    name: TName;
    title?: string;
    disabled?: boolean;
    control: Control<TFieldValues>;
    switchSx?: SxProps;
    formControlSx?: SxProps;
}

const Switch = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>(
    props: SwitchProps<TFieldValues, TName>
) => {
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
                <Tooltip title={title}>
                    <span>
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
                    </span>
                </Tooltip>
                <Typography>{checkedLabel}</Typography>
            </Stack>
        </FormControl>
    );
};

export default Switch;
