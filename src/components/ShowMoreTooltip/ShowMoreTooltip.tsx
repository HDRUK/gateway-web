import { ReactNode } from "react";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import Tooltip from "@/components/Tooltip";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

interface ShowMoreTooltipProps {
    items: string[];
    label?: string;
    showLimit?: number;
}

const linkWrapper = (allAdmins: string) => (children: ReactNode) => {
    return (
        <Tooltip key="allAdmins" title={allAdmins}>
            <span>{children}</span>
        </Tooltip>
    );
};

const ShowMoreTooltip = ({
    items,
    showLimit = 3,
    label = "...more",
}: ShowMoreTooltipProps) => {
    const allAdmins = items.join(", ");
    const topThree = items.slice(0, showLimit).join(", ");

    return (
        <ConditionalWrapper
            requiresWrapper={items.length > 2}
            wrapper={linkWrapper(allAdmins)}>
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
