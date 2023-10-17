/** @jsxImportSource @emotion/react */

import { FormControl, SxProps } from "@mui/material";
import CharacterLimit from "@/components/CharacterLimit";
import FormError from "@/components/FormError";
import Box from "@/components/Box";
import FormInfoLabel from "@/components/FormInfoLabel";
import { ReactNode, useMemo } from "react";
import { FieldError } from "react-hook-form";

interface FormInputWrapperProps {
    horizontalForm?: boolean;
    info?: string;
    formControlSx?: SxProps;
    label: string;
    value?: string | number;
    disabled?: boolean;
    fullWidth?: boolean;
    required?: boolean;
    limit?: number;
    children: ReactNode;
    error?: FieldError | FieldError[];
}

const FormInputWrapper = ({
    horizontalForm = false,
    info,
    label,
    disabled = false,
    required = false,
    formControlSx,
    limit,
    value,
    fullWidth = true,
    children,
    error,
}: FormInputWrapperProps) => {
    const characterCount = useMemo(() => {
        if (!value || typeof value !== "string") return 0;

        return value.length;
    }, [value]);

    return (
        <FormControl
            fullWidth={fullWidth}
            sx={{
                m: 0,
                mb: 2,
                ...(horizontalForm && {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }),
                ...formControlSx,
            }}>
            <Box sx={{ p: 0, ...(horizontalForm && { width: 200 }) }}>
                <FormInfoLabel
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
                {children}
                {error && <FormError error={error} />}
            </Box>
        </FormControl>
    );
};

export default FormInputWrapper;
