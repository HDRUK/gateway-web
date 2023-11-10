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
            {!horizontalForm && info && (
                <>
                    <TooltipIcon
                        align={false}
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
                    <FormHelperText
                        sx={{
                            fontSize: 13,
                            color: colors.grey700,
                        }}>
                        {info}
                    </FormHelperText>
                </>
            )}
            {info && horizontalForm && (
                <TooltipIcon
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
        </>
    );
};

export default FormInfoLabel;
