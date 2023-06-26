/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { ButtonProps } from "../Button/Button";
import Button from "../Button";
import * as styles from "./SquareButton.styles";

export interface SquareButtonProps extends ButtonProps {
    icon?: React.ReactNode;
}

const SquareButton = ({
    children,
    icon,
    color = "primary",
    ...rest
}: SquareButtonProps) => {
    const theme = useTheme();
    return (
        <Button
            disableRipple
            color={color}
            variant="text"
            css={styles.squareButton(theme, color)}
            {...rest}>
            <>
                {icon}
                {children}
            </>
        </Button>
    );
};

SquareButton.defaultProps = {
    icon: undefined,
};

export default SquareButton;
