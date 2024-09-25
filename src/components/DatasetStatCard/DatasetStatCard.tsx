"use client";

import Typography from "@mui/material/Typography";
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
    enableMetaScroll: boolean;
}

const DatasetStatCard = ({
    title,
    stat,
    largeStatText,
    iconSrc,
    unit,
    helperText,
    noStatText,
    enableMetaScroll,
}: DatasetStatCardProps) => {
    // This should really be using useRefs, but the ref should live in the parent page
    // which is a serverside component...
    // not great but if this needs expanding to other sections id possibly look at
    // splitting out the parent page into nested clientside components
    // Jamie Byrne
    const isGeoAndHasMeta = title === "Geographic coverage" && enableMetaScroll;
    const handleMetaScroll = () => {
        document.getElementById("anchor-StructuralMetadata")!.scrollIntoView();
    };
    return (
        <StatCard
            onClick={isGeoAndHasMeta ? () => handleMetaScroll() : undefined}
            sx={{
                ...(isGeoAndHasMeta ? { cursor: "pointer" } : {}),
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
                                        ? "'...see more"
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
        </StatCard>
    );
};

export default DatasetStatCard;
