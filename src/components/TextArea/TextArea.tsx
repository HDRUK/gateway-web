import Textfield from "@/components/Textfield";
import { TextfieldProps } from "../Textfield/Textfield";

export interface TextAreaProps extends TextfieldProps {
    rows?: number;
}

const TextArea = ({ rows, ...props }: TextAreaProps) => {
    return <Textfield {...props} multiline rows={rows} />;
};

TextArea.defaultProps = {
    rows: 4,
};

export default TextArea;
