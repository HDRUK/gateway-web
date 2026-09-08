import { tokens } from "@hdruk/ui/theme";
import { FormHelperText } from "@mui/material";
import Markdown from "markdown-to-jsx";
import Label from "@/components/Label";
import TooltipIcon from "@/components/TooltipIcon";

interface FormInfoLabelProps {
    horizontalForm?: boolean;
    disabled?: boolean;
    required?: boolean;
    info?: string;
    label: string;
    name?: string;
    onClick?: (e: React.MouseEvent) => void;
}

const FormInfoLabel = ({
    horizontalForm = false,
    info,
    name,
    label,
    disabled = false,
    required = false,
    onClick,
}: FormInfoLabelProps) => {
    return (
        <>
            {(!horizontalForm || (horizontalForm && !info)) && (
                <Label
                    name={name}
                    required={required}
                    label={label}
                    sx={{
                        ...(disabled && {
                            color: tokens.text.disabled,
                        }),
                    }}
                    onClick={onClick}
                />
            )}

            {!horizontalForm && info && (
                <FormHelperText
                    id={`${name}-information`}
                    sx={{
                        fontSize: 13,
                        color: tokens.text.faded,
                    }}>
                    <Markdown options={{
                        overrides: {
                        p: {
                            component: ({ children }) => <>{children}</>, 
                        },
                        },
                    }}>{info}</Markdown>
                </FormHelperText>
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
                                    color: tokens.text.disabled,
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
