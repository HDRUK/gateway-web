import React, { ComponentPropsWithoutRef } from "react";
import { CircularProgress } from "@mui/material";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonBaseProps = Pick<
    MuiButtonProps,
    | "disabled"
    | "variant"
    | "size"
    | "fullWidth"
    | "color"
    | "sx"
    | "disableRipple"
    | "startIcon"
    | "endIcon"
>;
export type ButtonProps = ButtonBaseProps &
    ComponentPropsWithoutRef<"button"> & {
        isLoading?: boolean;
    };

const Button: React.FC<ButtonProps> = ({
    color = "primary",
    variant = "contained",
    isLoading,
    children,
    ...rest
}) => {
    return (
        <MuiButton
            color={color}
            variant={variant}
            sx={{
                whiteSpace: "nowrap",
                ...rest.sx,
            }}
            {...rest}>
            {children}
            {isLoading && (
                <CircularProgress size={14} color="inherit" sx={{ ml: 1 }} />
            )}
        </MuiButton>
    );
};

export default Button;
