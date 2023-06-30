import { Box, BoxProps } from "@mui/material";
import React, { ComponentPropsWithoutRef, ReactNode } from "react";

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
