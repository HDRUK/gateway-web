import { FieldValues, Path } from "react-hook-form";
import TextFieldBase from "@/components/TextFieldBase";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";

const TextField = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    control,
    ...props
}: TextFieldBaseProps<TFieldValues, TName>) => {
    return (
        <TextFieldBase
            control={control}
            multiline={false}
            rows={undefined}
            limit={undefined}
            {...props}
        />
    );
};

export default TextField;
