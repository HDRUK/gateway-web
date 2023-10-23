import Box from "@/components/Box";
import Card from "@/components/Card";
import Typography from "@/components/Typography";
import CopyTextButton from "@/components/CopyTextButton";

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
                gridTemplateColumns: "2fr 2fr",
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
