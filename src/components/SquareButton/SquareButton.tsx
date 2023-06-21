/** @jsxImportSource @emotion/react */

import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@emotion/react";
import Button from "../Button";
import * as styles from "./SquareButton.styles";

export interface SquareButtonProps {
    children?: string;
}

const SquareButton = ({ children }: SquareButtonProps) => {
    const theme = useTheme();
    return (
        <Button disableRipple variant="text" css={styles.squareButton(theme)}>
            {children === "Create API" && (
                <AddIcon sx={{ height: "22px", width: "22px" }} />
            )}
            {children}
        </Button>
    );
};

SquareButton.defaultProps = {
    children: "",
};

export default SquareButton;
