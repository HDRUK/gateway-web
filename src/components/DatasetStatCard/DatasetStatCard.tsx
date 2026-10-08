"use client";

import { useId } from "react";
import Typography from "@mui/material/Typography";
import { hasValidValue, scrollToSection } from "@/utils/dataset";
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
    const descriptionId = useId();
    const isButton = enableScroll && !helperText;

    const handleScroll = () => scrollToSection(targetScroll);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleScroll();
        }
    };

    return (
        <StatCard
            role={isButton ? "button" : undefined}
            tabIndex={isButton ? 0 : undefined}
            onClick={isButton ? handleScroll : undefined}
            onKeyDown={isButton ? handleKeyDown : undefined}
            aria-describedby={descriptionId}
            sx={{
                ...(isButton ? { cursor: "pointer" } : {}),
                width: { xs: "60%", sm: "40%", lg: "100%" },
                flexShrink: 0,
                scrollSnapAlign: "start",
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
            <span id={descriptionId} style={{ zIndex: -1 }}>
                {helperText || `${title} statistic card`}
            </span>
        </StatCard>
    );
};

export default DatasetStatCard;
