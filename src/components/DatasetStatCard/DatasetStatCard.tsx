"use client";

import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { hasValidValue } from "@/utils/dataset";
import TooltipIcon from "../TooltipIcon";
import {
    InfoWrapper,
    StatCard,
    StatImage,
    StatImageWrapper,
    StatWrapper,
    Title,
} from "./DatasetStatCard.styles";

export interface DatasetStatCardProps {
    title: string;
    stat: string | string[];
    largeStatText?: boolean;
    iconSrc: string;
    unit?: string;
    helperText?: string;
    noStatText?: string;
    targetScroll: string;
    enableScroll: boolean;
}

const DatasetStatCard = ({
    title,
    stat,
    largeStatText,
    iconSrc,
    unit,
    helperText,
    noStatText,
    enableScroll,
    targetScroll,
}: DatasetStatCardProps) => {
    const descriptionId = `desc-${targetScroll}`;

    const handleScroll = () => {
        document?.getElementById(targetScroll)!.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (enableScroll && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleScroll();
        }
    };

    return (
        <StatCard
            tabIndex={0}
            onClick={enableScroll ? handleScroll : undefined}
            onKeyDown={handleKeyDown}
            aria-describedby={descriptionId}
            sx={{
                ...(enableScroll ? { cursor: "pointer" } : {}),
            }}>
            <Title>
                <Typography fontSize={16} sx={{ mb: 0, pt: 1, pb: 1 }}>
                    {title}
                </Typography>
                {helperText && (
                    <TooltipIcon content={helperText} label="" invertColor />
                )}
            </Title>

            <InfoWrapper>
                {hasValidValue(stat) ? (
                    <StatWrapper>
                        {Array.isArray(stat) ? (
                            stat.map((item, index) => (
                                <Typography
                                    fontSize={16}
                                    sx={{ alignSelf: "flex-start" }}
                                    key={`${stat}_${item}`}>
                                    {index < 2
                                        ? item
                                        : index === 3
                                        ? "...see more"
                                        : null}
                                </Typography>
                            ))
                        ) : (
                            <Typography fontSize={largeStatText ? 24 : 16}>
                                {stat}
                            </Typography>
                        )}
                        {hasValidValue(unit) && (
                            <Typography sx={{ pb: 1 }}>{unit}</Typography>
                        )}
                    </StatWrapper>
                ) : (
                    <StatWrapper>{noStatText}</StatWrapper>
                )}

                {iconSrc && (
                    <StatImageWrapper>
                        <StatImage src={iconSrc} alt="" fill />
                    </StatImageWrapper>
                )}
            </InfoWrapper>

            {/* this be a description for screen readers */}
            <span id={descriptionId} style={visuallyHidden}>
                {helperText || `${title} statistic card`}
            </span>
        </StatCard>
    );
};

export default DatasetStatCard;
