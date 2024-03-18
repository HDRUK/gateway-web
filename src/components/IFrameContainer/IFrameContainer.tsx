import { ReactNode } from "react";
import { IFrameWrapper } from "./IFrameContainer.styles";

interface IFrameContainerProps {
    children: ReactNode;
}

const IFrameContainer = ({ children }: IFrameContainerProps) => {
    return <IFrameWrapper>{children}</IFrameWrapper>;
};

export default IFrameContainer;
