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
}

const CheckboxControlled = (props: CheckboxProps) => {
    const {
        fullWidth = true,
        label = "",
        size = "medium",
        checkboxSx,
        formControlSx,
        count,
        ...rest
    } = props;

    return (
        <FormControl fullWidth={fullWidth} sx={{ m: 0, ...formControlSx }}>
            <FormControlLabel
                control={
                    <StyledCheckbox
                        size={size}
                        sx={{ ...checkboxSx }}
                        {...rest}
                    />
                }
                label={
                    count !== undefined ? (
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                            <EllipsisLineLimit text={label} showToolTip/>
                            <Typography sx={{ ml: 1 }} fontWeight={400}>
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
