import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

export interface FormPropsBase {
    children: ReactNode;
}

type FormProps = BoxProps & FormPropsBase & ComponentPropsWithoutRef<"form">;

const Form = ({ children, ...props }: FormProps) => {
    return (
        <Box component="form" noValidate {...props}>
            {children}
        </Box>
    );
};

export default Form;
