import { FieldValues, Path } from "react-hook-form";
import TextFieldBase from "@/components/TextFieldBase";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";

export interface TextAreaProps<TFieldValues extends FieldValues, TName>
    extends TextFieldBaseProps<TFieldValues, TName> {
    rows?: number;
    limit?: number;
}

const TextArea = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    rows = 4,
    limit,
    ...props
}: TextAreaProps<TFieldValues, TName>) => {
    return <TextFieldBase {...props} limit={limit} multiline rows={rows} />;
};

export default TextArea;
