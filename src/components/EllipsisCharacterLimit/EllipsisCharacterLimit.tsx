import { ReactNode } from "react";
import Button from "@/components/Button";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import Tooltip from "@/components/Tooltip";

interface EllipsisCharacterLimitProps {
    text: string;
    characterLimit?: number;
    isButton?: boolean;
}

const tooltipWrapper = (text: string) => (children: ReactNode) => {
    return (
        <Tooltip title={text} placement="bottom">
            <span>{children}</span>
        </Tooltip>
    );
};

const buttonWrapper = () => (children: ReactNode) => {
    return <Button size="small">{children}</Button>;
};

const EllipsisCharacterLimit = ({
    text,
    characterLimit = 50,
    isButton = false,
}: EllipsisCharacterLimitProps) => {
    const formattedText =
        text.length > characterLimit
            ? `${text.slice(0, characterLimit)}...`
            : text;

    return (
        <ConditionalWrapper
            requiresWrapper={isButton}
            wrapper={buttonWrapper()}>
            <ConditionalWrapper
                requiresWrapper={text.length > characterLimit}
                wrapper={tooltipWrapper(text)}>
                <span>{formattedText}</span>
            </ConditionalWrapper>
        </ConditionalWrapper>
    );
};

export default EllipsisCharacterLimit;
