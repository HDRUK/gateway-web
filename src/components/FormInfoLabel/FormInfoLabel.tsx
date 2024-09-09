import { FormHelperText } from "@mui/material";
import Label from "@/components/Label";
import TooltipIcon from "@/components/TooltipIcon";
import { colors } from "@/config/theme";

interface FormInfoLabelProps {
    horizontalForm?: boolean;
    disabled?: boolean;
    required?: boolean;
    info?: string | string[];
    label: string;
    name?: string;
}

interface RenderInfoProps {
    info: string | string[];
    name: string;
}

const RenderInfo = ({ info, name }: RenderInfoProps) => {
    return Array.isArray(info) ? (
        <div id={`${name}-information`}>
            {info.map(text => (
                <FormHelperText
                    key={text}
                    sx={{
                        fontSize: 13,
                        color: colors.grey700,
                    }}>
                    {text}
                </FormHelperText>
            ))}
        </div>
    ) : (
        <FormHelperText
            id={`${name}-information`}
            sx={{
                fontSize: 13,
                color: colors.grey700,
            }}>
            {info}
        </FormHelperText>
    );
};

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
            {(!horizontalForm || (horizontalForm && !info)) && (
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
            <tbody />

            {!horizontalForm && info && <RenderInfo info={info} name={name!} />}

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
