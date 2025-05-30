import { Card } from "@mui/material";
import Box from "@/components/Box";
import CopyTextButton from "@/components/CopyTextButton";
import Typography from "@/components/Typography";

interface CopyableCardProps {
    value: string | undefined;
    label: string;
    description: string;
}

const CopyableCard = ({ label, description, value }: CopyableCardProps) => {
    return (
        <Card
            sx={{
                display: "grid",
                gridTemplateColumns: { laptop: "2fr 2fr" },
            }}>
            <Box>
                <Typography
                    sx={{
                        fontWeight: 600,
                    }}>
                    {label}
                </Typography>
                <Typography>{description}</Typography>
            </Box>
            <Box>
                <CopyTextButton content={value} />
            </Box>
        </Card>
    );
};

export default CopyableCard;
