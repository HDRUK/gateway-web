import TextFieldBase from "@/components/TextFieldBase";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";

const TextField = ({ control, ...props }: TextFieldBaseProps) => {
    return (
        <TextFieldBase
            control={control}
            {...props}
            multiline={false}
            rows={undefined}
            limit={undefined}
        />
    );
};

export default TextField;
