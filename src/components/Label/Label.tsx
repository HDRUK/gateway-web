/** @jsxImportSource @emotion/react */

import { Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ComponentPropsWithoutRef } from "react";
import * as styles from "./Label.styles";

interface LabelProps extends ComponentPropsWithoutRef<"label"> {
    label: string;
    required?: boolean;
}

const Label = ({ label, required }: LabelProps) => {
    const theme = useTheme();

    return (
        <Typography variant="body2" css={styles.label({ theme, required })}>
            {label}
        </Typography>
    );
};

Label.defaultProps = {
    required: false,
};

export default Label;
