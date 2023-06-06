import TextFieldBase from "@/components/TextFieldBase";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";

const TextField = (props: TextFieldBaseProps) => {
    return (
        <TextFieldBase
            {...props}
            multiline={false}
            rows={undefined}
            limit={undefined}
        />
    );
};

export default TextField;
