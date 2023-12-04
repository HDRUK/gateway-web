/** @jsxImportSource @emotion/react */

import { Typography, TypographyProps } from "@mui/material";
import { ComponentPropsWithoutRef } from "react";
import * as styles from "./Label.styles";

type ExtendedProps = TypographyProps & ComponentPropsWithoutRef<"label">;

interface LabelProps extends ExtendedProps {
    name?: string;
    label: string;
    required?: boolean;
}

const Label = ({ label, name, required = false, ...rest }: LabelProps) => {
    return (
        <Typography
            variant="body2"
            css={styles.label({ required })}
            color={required ? "error" : "default"}
            {...rest}>
            <label htmlFor={name}>{label}</label>
        </Typography>
    );
};

export default Label;
