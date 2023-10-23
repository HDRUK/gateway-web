import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@/components/Button";
import Link from "@/components/Link";

interface ImageMediaCardProps {
    img: string;
    href: string;
    description?: string;
    buttonText: string;
}

const ImageMediaCard = ({
    description,
    img,
    buttonText,
    href,
}: ImageMediaCardProps) => {
    return (
        <Card
            sx={{
                width: 300,
                padding: 1,
                flex: 1,
                display: "flex",
                flexDirection: "column",
            }}>
            <CardMedia
                sx={{ objectFit: "contain", marginBottom: description ? 0 : 2 }}
                component="img"
                height={200}
                image={img}
            />
            {description && (
                <CardContent sx={{ flex: 1, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            )}
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Link
                    sx={{ width: "100%" }}
                    underline="none"
                    href={href}
                    passHref>
                    <Button sx={{ width: "100%" }}>{buttonText}</Button>
                </Link>
            </CardActions>
        </Card>
    );
};

ImageMediaCard.defaultProps = {
    description: "",
};

export default ImageMediaCard;
