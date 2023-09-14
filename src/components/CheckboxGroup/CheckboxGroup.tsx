/** @jsxImportSource @emotion/react */

import { CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import { FormLabel, Stack, SxProps } from "@mui/material";
import { Control } from "react-hook-form";
import Checkbox from "../Checkbox/Checkbox";

export interface CheckboxGroupProps extends MuiCheckboxProps {
    label: string;
    name: string;
    direction: "row" | "column";
    spacing: number;
    checkboxes: { value: string; label: string }[];
    control: Control;
    checkboxSx?: SxProps;
    formControlSx?: SxProps;
}

const CheckboxGroup = ({
    label,
    checkboxes,
    direction = "row",
    spacing = 1,
    ...rest
}: CheckboxGroupProps) => {
    return (
        <Stack alignItems="center" direction={direction} spacing={spacing}>
            <FormLabel>{label}</FormLabel>
            {checkboxes.map(checkbox => (
                <Checkbox
                    fullWidth={false}
                    key={checkbox.label}
                    {...rest}
                    {...checkbox}
                />
            ))}
        </Stack>
    );
};

CheckboxGroup.defaultProps = {
    checkboxSx: {},
    formControlSx: {},
};

export default CheckboxGroup;
