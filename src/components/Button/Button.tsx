import React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonBaseProps = Pick<MuiButtonProps, "variant" | "size" | "color">;
export interface ButtonProps extends ButtonBaseProps {
    children: string | React.ReactNode;
}

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
