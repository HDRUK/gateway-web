/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import Button from "@/components/Button";
import { ButtonProps } from "@/components/Button/Button";
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
