import Select from "../Select";
import { SelectProps } from "../Select/Select";
import TextArea from "../TextArea";
import { TextAreaProps } from "../TextArea/TextArea";
import Textfield from "../Textfield";
import { TextfieldProps } from "../Textfield/Textfield";

type ComponentTypes = "textField" | "select" | "textArea";
type InputType = TextfieldProps | SelectProps | TextAreaProps;

interface InputWrapperProps {
    component: ComponentTypes;
}

type Props = InputType & InputWrapperProps;
const InputWrapper = ({ component, ...props }: Props) => {
    const inputs = {
        textField: Textfield,
        select: Select,
        textArea: TextArea,
    };

    const Component = inputs[component as ComponentTypes];

    if (!Component) {
        throw Error(`${component} is not a valid input component`);
    }

    console.log(Component instanceof Select);

    return <Component {...props} />;
};

export default InputWrapper;
