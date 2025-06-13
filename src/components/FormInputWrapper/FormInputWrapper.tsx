import { ReactNode, useMemo } from "react";
import { FieldError } from "react-hook-form";
import { SxProps } from "@mui/material";
import Box from "@/components/Box";
import CharacterLimit from "@/components/CharacterLimit";
import FormError from "@/components/FormError";
import FormInfoLabel from "@/components/FormInfoLabel";
import Typography from "@/components/Typography";
import { colors } from "@/config/colors";

interface FormInputWrapperProps {
    horizontalForm?: boolean;
    extraInfo?: string;
    name?: string;
    info?: string;
    formControlSx?: SxProps;
    label: string;
    value?: string | number;
    disabled?: boolean;
    required?: boolean;
    limit?: number;
    children: ReactNode;
    error?: FieldError | FieldError[];
    onLabelClick?: (e: React.MouseEvent) => void;
}

const FormInputWrapper = ({
    horizontalForm = false,
    info,
    extraInfo,
    label,
    name,
    disabled = false,
    required = false,
    formControlSx,
    limit,
    value,
    children,
    error,
    onLabelClick,
}: FormInputWrapperProps) => {
    const characterCount = useMemo(() => {
        if (!value || typeof value !== "string") return 0;

        return value.length;
    }, [value]);

    return (
        <Box
            sx={{
                p: 0,
                m: 0,
                mb: 2,
                ...(horizontalForm && {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "top",
                }),
                ...formControlSx,
            }}>
            {label && (
                <Box sx={{ p: 0, ...(horizontalForm && { width: 200 }) }}>
                    <FormInfoLabel
                        name={name}
                        label={label}
                        horizontalForm={horizontalForm}
                        info={info}
                        disabled={disabled}
                        required={required}
                        onClick={onLabelClick}
                    />
                </Box>
            )}
            <Box sx={{ p: 0, flex: "1" }}>
                {limit && (
                    <CharacterLimit count={characterCount} limit={limit} />
                )}
                {extraInfo && (
                    <Typography fontSize={13} color={colors.grey600}>
                        {extraInfo}
                    </Typography>
                )}
                {children}
                {error && <FormError error={error} />}
            </Box>
        </Box>
    );
};

export default FormInputWrapper;
