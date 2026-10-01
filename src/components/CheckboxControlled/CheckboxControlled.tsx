import { FormControl, FormControlLabel, SxProps } from "@mui/material";
import { CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import Box from "../Box";
import EllipsisLineLimit from "../EllipsisLineLimit";
import StyledCheckbox from "../StyledCheckbox";
import Typography from "../Typography";

export interface CheckboxProps extends MuiCheckboxProps {
    label?: string;
    name: string;
    size?: "small" | "medium" | "large";
    fullWidth?: boolean;
    checkboxSx?: SxProps;
    formControlSx?: SxProps;
    count?: number;
    rawLabel?: string;
    stopPropagation?: boolean;
}

const CheckboxControlled = (props: CheckboxProps) => {
    const {
        fullWidth = true,
        label = "",
        size = "medium",
        checkboxSx,
        formControlSx,
        count,
        rawLabel,
        stopPropagation,
        ...rest
    } = props;

    const hasCount = count !== undefined && !!rawLabel;

    return (
        <FormControl fullWidth={fullWidth} sx={{ m: 0, ...formControlSx }}>
            <FormControlLabel
                sx={{
                    ...(hasCount && { alignItems: "flex-start" }),
                    "& .MuiFormControlLabel-label": {
                        minWidth: 0,
                        whiteSpace: "normal",
                        ...(hasCount && { pt: 1.25 }),
                    },
                }}
                control={
                    <StyledCheckbox
                        size={size}
                        sx={{ ...checkboxSx }}
                        stopPropagation={stopPropagation}
                        {...rest}
                    />
                }
                label={
                    hasCount ? (
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                "& > :first-of-type": { minWidth: 0 },
                            }}>
                            <EllipsisLineLimit
                                text={rawLabel}
                                showToolTip={rawLabel?.length > 70}
                            />
                            <Typography
                                sx={{ ml: 1, flexShrink: 0 }}
                                fontWeight={400}>
                                {count}
                            </Typography>
                        </Box>
                    ) : (
                        label
                    )
                }
            />
        </FormControl>
    );
};

export default CheckboxControlled;
