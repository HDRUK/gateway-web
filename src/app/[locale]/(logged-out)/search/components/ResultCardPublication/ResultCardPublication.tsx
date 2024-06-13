import { Divider, ListItem } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultPublication } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import ShowMore from "@/components/ShowMore";
import { OpenInNewIcon } from "@/consts/icons";
import {
    PublicationAbstract,
    PublicationText,
    PublicationTitle,
    PublicationTitleWrapper,
    PublicationWrapper,
    PublicationYear,
} from "./ResultCardPublication.styles";

interface ResultCardPublicationProps {
    result: SearchResultPublication;
}

const TRANSLATION_PATH = "pages.search.components.ResultCardPublication";

const ResultCardPublication = ({ result }: ResultCardPublicationProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const {
        abstract,
        authors,
        journal_name,
        paper_title,
        year_of_publication,
        full_text_url,
        url,
    } = result;

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <ListItem component="div">
                    <PublicationWrapper
                        disableTypography
                        primary={
                            <PublicationTitleWrapper>
                                <PublicationTitle
                                    href={full_text_url || url || ""}
                                    target="_blank">
                                    <EllipsisLineLimit
                                        text={paper_title || ""}
                                        showToolTip
                                        maxLine={1}
                                    />
                                    <OpenInNewIcon sx={{ ml: 2 }} />
                                </PublicationTitle>
                                <PublicationYear>
                                    {t("published")}:{" "}
                                    {year_of_publication || t("notAvailable")}
                                </PublicationYear>
                            </PublicationTitleWrapper>
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
            <Divider component="li" />
        </>
    );
};

export default ResultCardPublication;
