import { ReactNode } from "react";
import { Button, ButtonProps } from "@hdruk/ui";
import { Chip, Tooltip } from "@mui/material";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import { getShortenedText } from "@/utils/string";

interface EllipsisCharacterLimitProps extends ButtonProps {
    text: string;
    characterLimit?: number;
    isButton?: boolean;
    isChip?: boolean;
    action?: () => void;
}

const tooltipWrapper = (text: string) => {
    const TooltipWrapper = (children: ReactNode) => (
        <Tooltip title={text} placement="bottom" describeChild>
            <span>{children}</span>
        </Tooltip>
    );
    return TooltipWrapper;
};

const buttonWrapper = (rest: ButtonProps = {}) => {
    const ButtonWrapper = (children: ReactNode) => (
        <Button size="small" {...rest}>
            {children}
        </Button>
    );
    return ButtonWrapper;
};

const EllipsisCharacterLimit = ({
    text,
    characterLimit = 50,
    isButton = false,
    isChip = false,
    ...rest
}: EllipsisCharacterLimitProps) => {
    const formattedText = getShortenedText(text, characterLimit);

    return (
        <ConditionalWrapper
            requiresWrapper={isButton}
            wrapper={buttonWrapper(rest)}>
            <ConditionalWrapper
                requiresWrapper={text.length > characterLimit}
                wrapper={tooltipWrapper(text)}>
                {isChip ? (
                    <Chip label={formattedText} />
                ) : (
                    <span>{formattedText}</span>
                )}
            </ConditionalWrapper>
        </ConditionalWrapper>
    );
};

export default EllipsisCharacterLimit;
