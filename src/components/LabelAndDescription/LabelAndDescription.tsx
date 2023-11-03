import { ListItemText, Typography } from "@mui/material";

interface LabelAndDescriptionProps {
    label: string;
    description: string;
}
const LabelAndDescription = ({
    label,
    description,
}: LabelAndDescriptionProps) => {
    return (
        <ListItemText
            sx={{
                textWrap: "wrap",
            }}
            primary={
                <Typography
                    sx={{
                        fontWeight: 700,
                    }}>
                    {label}
                </Typography>
            }
            secondary={
                <Typography
                    sx={{
                        fontSize: "11px",
                    }}>
                    {description}
                </Typography>
            }
        />
    );
};

export default LabelAndDescription;
