import React, { ComponentPropsWithoutRef } from "react";
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
export type ButtonProps = ButtonBaseProps & ComponentPropsWithoutRef<"button">;

const Button: React.FC<ButtonProps> = ({
    color = "primary",
    variant = "contained",
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
        </MuiButton>
    );
};

export default Button;
