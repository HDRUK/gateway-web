import React from "react";
import "./button.css";

interface ButtonProps {
    variant: string;
    children: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    children,
    ...rest
}) => {
    return (
        <button type="button" className={`button ${variant} `} {...rest}>
            {children}
        </button>
    );
};

export default Button;
