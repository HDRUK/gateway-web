import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
    FormControl,
    FormControlLabel,
    Stack,
    Switch,
    SwitchProps,
    SxProps,
    Tooltip,
} from "@mui/material";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

export interface SwitchInlineProps<TFieldValues extends FieldValues, TName>
    extends SwitchProps<TFieldValues, TName> {
    extraInfo?: string;
    label?: string;
    control: Control<TFieldValues>;
    name: TName;
}

const SwitchInline = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>(
    props: SwitchInlineProps<TFieldValues, TName>
) => {
    const { label, extraInfo, ...rest } = props;

    return (
        <FormControl
            fullWidth
            sx={{ m: 0, mb: 2, ...formControlSx, ml: 0, mr: 0 }}
            error={!!error}>
            <FormControlLabel
                componentsProps={{
                    typography: {
                        ml: 2,
                    },
                }}
                sx={{
                    m: 0,
                }}
                control={
                    <Tooltip title={title}>
                        <span>
                            <Switch
                                size={size}
                                disableRipple
                                {...rest}
                                {...fieldProps}
                                disabled={disabled}
                                checked={fieldProps.value}
                                inputRef={ref}
                                sx={{ ...switchSx, mb: 0 }}
                                inputProps={{
                                    "aria-describedby": extraInfo
                                        ? `${name}-description`
                                        : undefined,
                                }}
                            />
                        </span>
                    </Tooltip>
                }
                label={
                    <Stack>
                        {label}
                        {extraInfo && (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                id={`${name}-description`}>
                                {extraInfo}
                            </Typography>
                        )}
                    </Stack>
                }
            />
        </FormControl>
    );
};

export default SwitchInline;
