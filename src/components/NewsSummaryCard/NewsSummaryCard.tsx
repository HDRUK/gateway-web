import { Box, Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { ArrowForward } from "@/consts/icons";
import { formatDate } from "@/utils/date";
import EllipsisLineLimit from "../EllipsisLineLimit";
import Link from "../Link";
import { DateBox } from "./NewsSummaryCard.styles";

interface NewsSummaryCardProps {
    buttonText: string;
    headline: string;
    summary: string;
    date: string;
    url: string;
    imageLink?: string;
    imageAlt?: string;
    imageHeight?: string;
    variant?: "content" | "feature";
}

const NewsSummaryCard = ({
    variant = "content",
    buttonText,
    headline,
    summary,
    date,
    url,
    imageLink,
    imageAlt,
    imageHeight = "225px",
}: NewsSummaryCardProps) => {
    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: { tablet: 345 },
                background: "transparent",
                position: "relative",
            }}>
            <CardMedia
                component="img"
                height={imageHeight}
                image={imageLink}
                alt={imageAlt}
            />
            <DateBox>
                <div>{formatDate(date, "MMM")}</div>
                <div>{formatDate(date, "DD")}</div>
            </DateBox>
            <CardContent>
                <Typography
                    gutterBottom
                    fontSize={20}
                    variant="h5"
                    component="div"
                    textAlign="left">
                    <EllipsisLineLimit maxLine={2} text={headline} />
                </Typography>
                <Typography variant="body2" textAlign="left" component="div">
                    <EllipsisLineLimit maxLine={4} text={summary} />
                </Typography>
                {variant === "content" && (
                    <Box sx={{ mt: 1 }}>
                        <Link href={url} underline="hover">
                            {buttonText}
                        </Link>
                    </Box>
                )}
            </CardContent>
            {variant === "feature" && (
                <CardActions>
                    <Link href={url} color="primary" passHref>
                        <Button
                            variant="text"
                            endIcon={<ArrowForward color="primary" />}>
                            {buttonText}
                        </Button>
                    </Link>
                </CardActions>
            )}
        </Card>
    );
};

export default NewsSummaryCard;
