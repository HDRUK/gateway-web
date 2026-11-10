import { ReactNode } from "react";
import { Tooltip } from "@mui/material";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

interface ShowMoreTooltipProps {
    items: string[];
    label?: string;
    showLimit?: number;
}

const linkWrapper = (title: string) => {
    const LinkWrapper = (children: ReactNode) => (
        <Tooltip title={title} describeChild>
            <span>{children}</span>
        </Tooltip>
    );
    return LinkWrapper;
};

const ShowMoreTooltip = ({
    items,
    showLimit = 3,
    label = "...more",
}: ShowMoreTooltipProps) => {
    const allItems = items.join(", ");
    const topThree = items.slice(0, showLimit).join(", ");

    return (
        <ConditionalWrapper
            requiresWrapper={items.length > 2}
            wrapper={linkWrapper(allItems)}>
            <>
                {topThree}
                <Typography component="span" sx={{ color: colors.grey500 }}>
                    {items.length > showLimit ? label : ""}
                </Typography>
            </>
        </ConditionalWrapper>
    );
};

export default ShowMoreTooltip;
