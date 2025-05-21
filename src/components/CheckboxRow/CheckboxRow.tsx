import { FieldValues, Path } from "react-hook-form";
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
    ...rest
}: CheckboxRowProps<FieldValues, TName>) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}>
            <Typography sx={{ width: "100px" }}>{title} test</Typography>
            <StyledCheckbox formControlSx={{ marginBottom: 0 }} {...rest} />
        </Box>
    );
};

export default CheckboxRow;
