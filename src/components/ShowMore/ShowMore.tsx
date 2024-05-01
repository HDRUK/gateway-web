import { ReactNode, useEffect, useRef, useState } from "react";
import getNodeDimensions from "get-node-dimensions";
import { useTranslations } from "next-intl";
import ShowMoreButton from "./ShowMoreButton";

interface ShowMoreProps {
    children: ReactNode;
    maxHeight: number;
}

const ShowMore = ({ children, maxHeight }: ShowMoreProps) => {
    const t = useTranslations("components.ShowMore");
    const [needsMoreButton, setNeedsMoreButton] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const myRef = useRef(null);

    useEffect(() => {
        if (!myRef.current) return;
        const { height } = getNodeDimensions(myRef.current);
        setNeedsMoreButton(height > maxHeight);
    }, [maxHeight, children]);

    return (
        <div>
            <div
                style={{
                    overflowY: "hidden",
                    maxHeight: showAll ? "none" : maxHeight,
                }}>
                {children}
            </div>
            {needsMoreButton && (
                <ShowMoreButton
                    onClick={() => setShowAll(showAll => !showAll)}
                    open={showAll}>
                    {showAll ? t("showLess") : t("showMore")}
                </ShowMoreButton>
            )}
            <div ref={myRef} style={{ display: "none" }}>
                {children}
            </div>
        </div>
    );
};

export default ShowMore;
