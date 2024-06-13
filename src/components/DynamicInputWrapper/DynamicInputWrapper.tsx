import { Control } from "react-hook-form";
import { isPlainObject } from "lodash";
import { Metadata } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";
import { capitalise, splitCamelcase } from "@/utils/general";
import Typography from "../Typography";

interface InputSectionWrapperProps {
    name?: string;
    control: Control;
    level: string | { [key: string]: string };
}

/* todo: Interim component to render dynamic fields */
const DynamicInputWrapper = ({
    level,
    name,
    ...rest
}: InputSectionWrapperProps) => {
    if (isPlainObject(level)) {
        return (
            <>
                {Object.keys(level).map(key => {
                    if (
                        typeof level === "object" &&
                        typeof level[key as keyof Metadata] === "string"
                    ) {
                        return (
                            <InputWrapper
                                label={capitalise(splitCamelcase(key))}
                                name={name ? `${name}.${key}` : key}
                                key={name ? `${name}.${key}` : key}
                                {...rest}
                                component={inputComponents.TextField}
                                required
                            />
                        );
                    }
                    if (
                        typeof level === "object" &&
                        isPlainObject(level[key])
                    ) {
                        return (
                            <Box
                                key={name ? `${name}.${key}` : key}
                                sx={{
                                    borderBottom: `1px solid ${colors.grey300}`,
                                    mb: 2,
                                }}>
                                <Typography fontWeight="bold" sx={{ mb: 2 }}>
                                    {capitalise(splitCamelcase(key))}
                                </Typography>
                                <DynamicInputWrapper
                                    name={name ? `${name}.${key}` : key}
                                    level={level[key]}
                                    {...rest}
                                />
                            </Box>
                        );
                    }
                    return null;
                })}
            </>
        );
    }
    return null;
};

export default DynamicInputWrapper;
