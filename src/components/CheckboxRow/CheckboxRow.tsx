import { FieldValues, Path, useController } from "react-hook-form";
import Box from "@/components/Box";
import { CheckboxProps } from "@/components/Checkbox/Checkbox";
import Typography from "@/components/Typography";
import StyledCheckbox from "../StyledCheckbox";

export interface CheckboxRowProps<TFieldValues extends FieldValues, TName>
    extends CheckboxProps<TFieldValues, TName> {
    title: string;
}

const CheckboxRow = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    title,
    name,
    control,
    id,
    label: _label,
    ...rest
}: CheckboxRowProps<FieldValues, TName>) => {
    const {
        field: { ref, value, ...fieldProps },
    } = useController({
        name,
        control,
    });

    const inputId = id || name;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}>
            <Typography id={`${inputId}-label`} sx={{ width: "100px" }}>
                {title}
            </Typography>
            <StyledCheckbox
                {...rest}
                {...fieldProps}
                id={inputId}
                checked={!!value}
                inputRef={ref}
                inputProps={{ "aria-labelledby": `${inputId}-label` }}
            />
        </Box>
    );
};

export default CheckboxRow;
