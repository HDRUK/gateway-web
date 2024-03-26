import { FieldValues } from "react-hook-form";
import TextFieldBase from "@/components/TextFieldBase";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";

const TextField = <T extends FieldValues>({
    control,
    ...props
}: TextFieldBaseProps<T>) => {
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
