import { ReactNode, useState } from "react";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "../Typography";

export interface ExpandListProps {
    buttonTextHide?: string;
    buttonTextExpand?: string;
    heading: string | ReactNode;
    showCount?: number;
    showLessButton?: boolean;
    listItems: (string | ReactNode)[];
}

const ExpandList = ({
    heading,
    listItems,
    showCount = 2,
    showLessButton = false,
    buttonTextExpand = "Show more",
    buttonTextHide = "Show less",
}: ExpandListProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Box
            sx={{
                p: 0,
                mb: 2,
            }}>
            <Typography sx={{ mb: 1 }}>{heading}</Typography>
            <ul
                style={{
                    paddingLeft: "15px",
                    margin: 0,
                }}>
                {(expanded ? listItems : listItems.slice(0, showCount)).map(
                    listItem => {
                        return <li key={listItem?.toString()}>{listItem}</li>;
                    }
                )}
            </ul>
            {listItems.length > showCount && !expanded && (
                <Button
                    sx={{ mt: 1 }}
                    variant="link"
                    onClick={() => setExpanded(true)}>
                    {buttonTextExpand}
                </Button>
            )}
            {showLessButton && expanded && (
                <Button
                    sx={{ mt: 1 }}
                    variant="link"
                    onClick={() => setExpanded(false)}>
                    {buttonTextHide}
                </Button>
            )}
        </Box>
    );
};

export default ExpandList;
