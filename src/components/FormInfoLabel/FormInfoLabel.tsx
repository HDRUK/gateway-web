import { FormHelperText } from "@mui/material";
import { colors } from "@/config/theme";
import Label from "@/components/Label";
import TooltipIcon from "@/components/TooltipIcon";

interface FormInfoLabelProps {
    horizontalForm?: boolean;
    disabled?: boolean;
    required?: boolean;
    info?: string;
    label: string;
    name?: string;
}

const FormInfoLabel = ({
    horizontalForm = false,
    info,
    name,
    label,
    disabled = false,
    required = false,
}: FormInfoLabelProps) => {
    return (
        <>
            {horizontalForm && !info && (
                <Label
                    name={name}
                    required={required}
                    label={label}
                    sx={{
                        ...(disabled && {
                            color: colors.grey600,
                        }),
                    }}
                />
            )}
            {info && (
                <TooltipIcon
                    align={horizontalForm}
                    label={
                        <Label
                            name={name}
                            required={required}
                            label={label}
                            sx={{
                                ...(disabled && {
                                    color: colors.grey600,
                                }),
                            }}
                        />
                    }
                    content={<div>{info}</div>}
                />
            )}
            {!horizontalForm && info && (
                <FormHelperText
                    sx={{
                        fontSize: 13,
                        color: colors.grey700,
                    }}>
                    {info}
                </FormHelperText>
            )}
        </>
    );
};

export default FormInfoLabel;
