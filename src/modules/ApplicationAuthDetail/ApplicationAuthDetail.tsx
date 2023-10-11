import Box from "@/components/Box";
import Card from "@/components/Card";
import Typography from "@/components/Typography";
import CopyTextBox from "@/components/CopyTextBox";


interface ApplicationAuthDetailProps {
    value: string | undefined,
    label: string,
    description: string,
}

const ApplicationAuthDetail = (props : ApplicationAuthDetailProps) => {
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
                <CopyTextBox content={props.value}/>
            </Box>
        </Card>
    );
}

export default ApplicationAuthDetail;
