import { Control, FieldPath, FieldValues } from "react-hook-form";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import { InputWrapperCombinedProps } from "@/components/InputWrapper/InputWrapper";
import { colors } from "@/config/theme";

interface InputSectionWrapperProps<TFieldValues extends FieldValues, TName> {
    sections: {
        id: number;
        title?: string;
        fields: Omit<
            InputWrapperCombinedProps<FieldValues, TName>,
            "control"
        >[];
    }[];
    control: Control<TFieldValues>;
}

const InputSectionWrapper = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    sections,
    control,
}: InputSectionWrapperProps<TFieldValues, TName>) => {
    return (
        <>
            {sections.map(section => (
                <Box
                    key={section.id}
                    sx={{
                        borderTop: `solid 1px ${colors.grey400}`,
                        p: "24px 18px",
                    }}>
                    {section.fields.map(field => (
                        <InputWrapper
                            key={field.name}
                            {...field}
                            control={control}
                        />
                    ))}
                </Box>
            ))}
        </>
    );
};

export default InputSectionWrapper;
