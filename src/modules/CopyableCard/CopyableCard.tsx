import Box from "@/components/Box";
import Card from "@/components/Card";
import Typography from "@/components/Typography";
import CopyTextButton from "@/components/CopyTextButton";


interface CopyableCardProps {
    value: string | undefined,
    label: string,
    description: string,
}

const CopyableCard = (props : CopyableCardProps) => {
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
                    {props.label}
                </Typography>
                <Typography>
                    {props.description}
                </Typography>
            </Box>
            <Box>
                <CopyTextButton content={props.value}/>
            </Box>
        </Card>
    );
}

export default CopyableCard;
