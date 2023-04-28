import React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

const Button: React.FC<MuiButtonProps> = ({
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
