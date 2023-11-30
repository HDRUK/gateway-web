import TextFieldBase from "@/components/TextFieldBase";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";

export interface TextAreaProps extends TextFieldBaseProps {
    rows?: number;
    limit?: number;
}

const TextArea = ({ rows = 4, limit, ...props }: TextAreaProps) => {
    return <TextFieldBase {...props} limit={limit} multiline rows={rows} />;
};

export default TextArea;
