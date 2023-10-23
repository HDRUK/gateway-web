/** @jsxImportSource @emotion/react */

import { SxProps } from "@mui/material";
import CharacterLimit from "@/components/CharacterLimit";
import FormError from "@/components/FormError";
import Box from "@/components/Box";
import FormInfoLabel from "@/components/FormInfoLabel";
import { ReactNode, useMemo } from "react";
import { FieldError } from "react-hook-form";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

interface FormInputWrapperProps {
    horizontalForm?: boolean;
    extraInfo?: string;
    name: string;
    info?: string;
    formControlSx?: SxProps;
    label: string;
    value?: string | number;
    disabled?: boolean;
    required?: boolean;
    limit?: number;
    children: ReactNode;
    error?: FieldError | FieldError[];
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
            <Box sx={{ p: 0, ...(horizontalForm && { width: 200 }) }}>
                <FormInfoLabel
                    name={name}
                    label={label}
                    horizontalForm={horizontalForm}
                    info={info}
                    disabled={disabled}
                    required={required}
                />
            </Box>
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
