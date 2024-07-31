import { ReactNode } from "react";
import { ButtonProps } from "@mui/material/Button";
import Button from "@/components/Button";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import Tooltip from "@/components/Tooltip";

interface EllipsisCharacterLimitProps extends ButtonProps {
    text: string;
    characterLimit?: number;
    isButton?: boolean;
    action?: () => void;
}

const tooltipWrapper = (text: string) => (children: ReactNode) => {
    return (
        <Tooltip title={text} placement="bottom">
            <span>{children}</span>
        </Tooltip>
    );
};

const buttonWrapper =
    (rest = {}) =>
    (children: ReactNode) => {
        return (
            <Button size="small" {...rest}>
                {children}
            </Button>
        );
    };

const EllipsisCharacterLimit = ({
    text,
    characterLimit = 50,
    isButton = false,
    ...rest
}: EllipsisCharacterLimitProps) => {
    const formattedText =
        text.length > characterLimit
            ? `${text.slice(0, characterLimit)}...`
            : text;

    return (
        <ConditionalWrapper
            requiresWrapper={isButton}
            wrapper={buttonWrapper(rest)}>
            <ConditionalWrapper
                requiresWrapper={text.length > characterLimit}
                wrapper={tooltipWrapper(text)}>
                <span>{formattedText}</span>
            </ConditionalWrapper>
        </ConditionalWrapper>
    );
};

export default EllipsisCharacterLimit;
