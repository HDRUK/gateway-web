import { ReactNode, useEffect } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useForm } from "react-hook-form";
import { css } from "@emotion/react";
import {
    OutlinedInput,
    Select as MuiSelect,
    MenuItem,
    SxProps,
} from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import FormInputWrapper from "@/components/FormInputWrapper";
import Select from "@/components/Select";
import SelectMenuItem from "@/components/SelectMenuItem";
import TextField from "@/components/TextField";
import Box from "../Box";

type ValueType = string | number;
export interface SelectOptionsType {
    value: ValueType;
    label: string;
    labelComponent?: ReactNode;
    icon?: IconType;
}

export interface SelectProps<TFieldValues extends FieldValues, TName> {
    label: string;
    info?: string;
    extraInfo?: string;
    iconRight?: boolean;
    disabled?: boolean;
    invertListItem?: boolean;
    options: SelectOptionsType[];
    multiple?: boolean;
    horizontalForm?: boolean;
    icon?: IconType;
    name: TName;
    control: Control<TFieldValues>;
    required?: boolean;
    hasCheckbox?: boolean;
    formControlSx?: SxProps;
}

const SelectMultipleOption = ({ option }) => {
    const { control, reset } = useForm({
        defaultValues: {
            label: option.label,
        },
    });

    useEffect(() => {
        reset(option);
    }, [reset, option]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                alignContents: "center",
                gap: 2,
                m: 0,
                py: 0,
                px: 1,
            }}>
            <TextField
                formControlSx={{
                    marginBottom: 0,
                }}
                label=""
                name="label"
                placeholder="label"
                control={control}
            />
        </Box>
    );
};

export default SelectMultipleOption;
