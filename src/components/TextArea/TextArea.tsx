import TextFieldBase from "@/components/TextFieldBase";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";

export interface TextAreaProps extends TextFieldBaseProps {
    rows?: number;
    limit?: number;
}

const TextArea = ({ rows, limit, ...props }: TextAreaProps) => {
    return <TextFieldBase {...props} limit={limit} multiline rows={rows} />;
};

TextArea.defaultProps = {
    rows: 4,
    limit: undefined,
};

export default TextArea;
