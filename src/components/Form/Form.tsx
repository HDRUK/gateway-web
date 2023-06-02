import React, { ComponentPropsWithoutRef, ReactNode } from "react";

export interface FormProps extends ComponentPropsWithoutRef<"form"> {
    children: ReactNode;
}

const Form = ({ children, ...props }: FormProps) => {
    return (
        <form noValidate {...props}>
            {children}
        </form>
    );
};

export default Form;
