import { FieldValues } from "react-hook-form";
import TextFieldBase from "@/components/TextFieldBase";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";

export interface TextAreaProps<T extends FieldValues>
    extends TextFieldBaseProps<T> {
    rows?: number;
    limit?: number;
}

const TextArea = <T extends FieldValues>({
    rows = 4,
    limit,
    ...props
}: TextAreaProps<T>) => {
    return <TextFieldBase {...props} limit={limit} multiline rows={rows} />;
};

export default TextArea;
