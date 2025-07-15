import { ReactElement } from "react";

interface ConditionalWrapperProps {
    requiresWrapper: boolean;
    wrapper: (children: ReactElement) => JSX.Element;
    children: JSX.Element;
}

const ConditionalWrapper = ({
    requiresWrapper,
    wrapper,
    children,
}: ConditionalWrapperProps) => (requiresWrapper ? wrapper(children) : children);

export default ConditionalWrapper;
