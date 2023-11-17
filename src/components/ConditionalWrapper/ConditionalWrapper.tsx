import { ReactNode } from "react";

interface ConditionalWrapperProps {
    requiresWrapper: boolean;
    wrapper: (children: ReactNode) => JSX.Element;
    children: JSX.Element;
}

const ConditionalWrapper = ({
    requiresWrapper,
    wrapper,
    children,
}: ConditionalWrapperProps) => (requiresWrapper ? wrapper(children) : children);

export default ConditionalWrapper;
