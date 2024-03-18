import Typography from "@mui/material/Typography";
import TooltipIcon from "../TooltipIcon";
import {
    InfoWrapper,
    StatCard,
    StatImage,
    StatImageWrapper,
    StatWrapper,
    Title,
} from "./DatasetStatCard.styles";

interface DatasetStatCardProps {
    title: string;
    stat: string | string[];
    largeStatText: boolean;
    iconSrc: string;
    unit: string;
    helperText: string;
}

const DatasetStatCard = ({
    title,
    stat,
    largeStatText,
    iconSrc,
    unit,
    helperText,
}: DatasetStatCardProps) => {
    return (
        <StatCard
            sx={{
                width: 195,
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
                <StatWrapper>
                    {Array.isArray(stat) ? (
                        stat.map(item => (
                            <Typography
                                fontSize={16}
                                sx={{ alignSelf: "flex-start" }}>
                                {item}
                            </Typography>
                        ))
                    ) : (
                        <Typography fontSize={largeStatText ? 24 : 16}>
                            {stat}
                        </Typography>
                    )}
                    <Typography sx={{ pb: 1 }}>{unit}</Typography>
                </StatWrapper>

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
