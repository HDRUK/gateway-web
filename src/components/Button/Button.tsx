import React from "react";
import MuiButton from "@mui/material/Button";

interface ButtonProps {
    color: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    variant: "contained" | "outlined" | "text";
    children: string;
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
