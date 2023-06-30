import React, { ComponentPropsWithoutRef } from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonBaseProps = Pick<
    MuiButtonProps,
    "variant" | "size" | "color" | "sx" | "disableRipple"
>;
export type ButtonProps = ButtonBaseProps & ComponentPropsWithoutRef<"button">;

const Button: React.FC<ButtonProps> = ({
    color = "primary",
    variant = "contained",
    children,
    ...rest
}) => {
    return (
        <MuiButton color={color} variant={variant} {...rest}>
            {children}
        </MuiButton>
    );
};

export default Button;
