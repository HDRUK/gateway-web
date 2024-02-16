import { SxProps } from "@mui/material";
import MuiCheckbox, {
    CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    CheckboxIndeterminateIcon,
} from "@/consts/icons";

export interface StyledCheckboxProps extends MuiCheckboxProps {
    size: "small" | "medium" | "large";
    iconSx?: SxProps;
}

const StyledCheckbox = ({ size, iconSx, ...rest }: StyledCheckboxProps) => {
    return (
        <MuiCheckbox
            disableRipple
            icon={<CheckboxIcon sx={{ ...iconSx }} size={size} />}
            checkedIcon={<CheckboxCheckedIcon sx={{ ...iconSx }} size={size} />}
            indeterminateIcon={
                <CheckboxIndeterminateIcon sx={{ ...iconSx }} size={size} />
            }
            {...rest}
        />
    );
};

export default StyledCheckbox;
