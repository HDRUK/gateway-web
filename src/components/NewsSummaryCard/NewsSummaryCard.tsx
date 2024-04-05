import { Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { ArrowForward } from "@/consts/icons";
import { formatDate } from "@/utils/date";
import EllipsisLineLimit from "../EllipsisLineLimit";
import { DateBox } from "./NewsSummaryCard.styles";

interface NewsSummaryCardProps {
    buttonText: string;
    headline: string;
    summary: string;
    date: string;
    url: string;
    imageLink: string;
    imageAlt: string;
}

const NewsSummaryCard = ({
    buttonText,
    headline,
    summary,
    date,
    url,
    imageLink,
    imageAlt,
}: NewsSummaryCardProps) => {
    return (
        <Card
            sx={{
                maxWidth: { tablet: 345 },
                background: "transparent",
                position: "relative",
            }}>
            <CardMedia
                component="img"
                height="140"
                image={imageLink}
                alt={imageAlt}
            />
            <DateBox>
                <div>{formatDate(date, "MMM")}</div>
                <div> {formatDate(date, "DD")}</div>
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
            </CardContent>
            <CardActions>
                <Link href={url} color="primary" passHref>
                    <Button
                        variant="text"
                        endIcon={<ArrowForward color="primary" />}>
                        {buttonText}
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
};

export default NewsSummaryCard;
