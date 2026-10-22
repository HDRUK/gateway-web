import {
    Box,
    ListItem,
    ListItemText,
    Skeleton,
    Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import ButtonSkeleton from "./ButtonSkeleton";
import { item, text, titleRow, titleText } from "./ResultCardSkeleton.styles";

const DESCRIPTION_LINE_WIDTHS = ["100%", "70%"];

const ResultCardSkeleton = () => {
    const t = useTranslations("pages.search.components.ResultCardTool");

    return (
        <ListItem sx={item} alignItems="flex-start">
            <ListItemText
                disableTypography
                sx={text}
                primary={
                    <Box sx={titleRow}>
                        <Typography variant="body1" sx={titleText}>
                            <Skeleton width="60%" />
                        </Typography>
                        <ButtonSkeleton size="small" purpose="secondary">
                            {t("showAll")}
                        </ButtonSkeleton>
                    </Box>
                }
                secondary={DESCRIPTION_LINE_WIDTHS.map(width => (
                    <Typography key={width} variant="body2">
                        <Skeleton width={width} />
                    </Typography>
                ))}
            />
        </ListItem>
    );
};

export default ResultCardSkeleton;
