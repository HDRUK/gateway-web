import { useRef, useState, useEffect, ReactNode } from "react";
import { Button } from "@mui/material";
import getNodeDimensions from "get-node-dimensions";
import { useTranslations } from "next-intl";
import { ArrowDropDownIcon } from "@/consts/icons";

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
                <Button
                    style={{ whiteSpace: "nowrap" }}
                    size="small"
                    onClick={() => setShowAll(previous => !previous)}
                    endIcon={
                        <ArrowDropDownIcon
                            fontSize="large"
                            sx={{
                                transform: `rotate(${showAll ? 180 : 0}deg)`,
                            }}
                            color="primary"
                        />
                    }
                    variant="link">
                    {showAll ? t("showLess") : t("showMore")}
                </Button>
            )}
            <div ref={myRef} style={{ display: "none" }}>
                {children}
            </div>
        </div>
    );
};

export default ShowMore;
