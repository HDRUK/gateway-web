import { InputWrapperCombinedProps } from "@/components/InputWrapper/InputWrapper";
import InputWrapper from "@/components/InputWrapper";
import { Control } from "react-hook-form";
import Box from "@/components/Box";
import { colors } from "@/config/theme";

interface InputSectionWrapperProps {
    sections: {
        id: number;
        title?: string;
        fields: InputWrapperCombinedProps[];
    }[];
    control: Control;
}

const InputSectionWrapper = ({
    sections,
    control,
}: InputSectionWrapperProps) => {
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
