import { ListItem, useMediaQuery, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultPublication } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import ShowMore from "@/components/ShowMore";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { OpenInNewIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    PublicationAbstract,
    PublicationText,
    PublicationTitle,
    PublicationWrapper,
    PublicationYear,
} from "./ResultCardPublication.styles";

interface ResultCardPublicationProps {
    result: SearchResultPublication;
}

const TRANSLATION_PATH = "pages.search.components.ResultCardPublication";

const ResultCardPublication = ({ result }: ResultCardPublicationProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const theme = useTheme();
    const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("laptop"));

    const {
        abstract,
        authors,
        journal_name,
        paper_title,
        year_of_publication,
        full_text_url,
        url,
        _id,
    } = result;

    return (
        <ListItem
            sx={{ p: 0, borderBottom: `1px solid ${colors.grey300}` }}
            alignItems="flex-start">
            <ListItem component="div">
                <PublicationWrapper
                    disableTypography
                    primary={
                        <Typography
                            sx={{
                                display: "flex",
                                flexDirection: {
                                    laptop: "row",
                                    tablet: "column",
                                    mobile: "column",
                                },
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                marginBottom: theme.spacing(1),
                            }}>
                            <PublicationTitle
                                href={
                                    _id
                                        ? `${RouteName.PUBLICATION}/${_id}`
                                        : full_text_url || url || ""
                                }
                                target={_id ? "_blank" : "self"}>
                                <EllipsisLineLimit
                                    text={paper_title || ""}
                                    showToolTip
                                    maxLine={isMobileOrTablet ? 2 : 1}
                                />
                                {!_id && (
                                    <OpenInNewIcon
                                        sx={{ ml: isMobileOrTablet ? 1 : 2 }}
                                    />
                                )}
                            </PublicationTitle>
                            <PublicationYear>
                                {t("published")}:{" "}
                                {year_of_publication || t("notAvailable")}
                            </PublicationYear>
                        </Typography>
                    }
                    secondary={
                        <>
                            <div>
                                <ShowMore maxHeight={21}>
                                    <PublicationText sx={{ m: 0 }}>
                                        {authors || t("notAvailable")}
                                    </PublicationText>
                                </ShowMore>
                            </div>

                            <PublicationText>
                                {journal_name || t("notAvailable")}
                            </PublicationText>
                            <PublicationAbstract
                                maxLine={2}
                                text={abstract || t("notAvailable")}
                            />
                        </>
                    }
                />
            </ListItem>
        </ListItem>
    );
};

export default ResultCardPublication;
