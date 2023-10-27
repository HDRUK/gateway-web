import { InputWrapperCombinedProps } from "@/components/InputWrapper/InputWrapper";
import InputWrapper from "@/components/InputWrapper";
import { Control } from "react-hook-form";
import Box from "@/components/Box";
import { colors } from "@/config/theme";

interface InputSectionWrapperProps {
    sections: InputWrapperCombinedProps[][];
    control: Control;
}

const InputSectionWrapper = ({
    sections,
    control,
}: InputSectionWrapperProps) => {
    return (
        <>
            {sections.map(sectionFields => (
                <Box sx={{ borderTop: `solid 1px ${colors.grey400}` }}>
                    {sectionFields.map(sectionField => (
                        <InputWrapper
                            key={sectionField.name}
                            {...sectionField}
                            control={control}
                        />
                    ))}
                </Box>
            ))}
        </>
    );
};

export default InputSectionWrapper;
