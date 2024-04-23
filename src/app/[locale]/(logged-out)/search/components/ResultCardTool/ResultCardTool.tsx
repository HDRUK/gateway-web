import { Divider, ListItem, ListItemButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultTool } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import {
    ToolWrapper,
    ToolTitle,
    ToolTitleWrapper,
    ToolDescription,
} from "./ResultCardTool.styles";

interface ResultCardPublicationProps {
    result: SearchResultTool;
}

const TRANSLATION_PATH = "pages.search.components.ResultCardPublication";

const ResultCardTool = ({ result }: ResultCardPublicationProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    /* eslint no-underscore-dangle: 0 */
    const { name, description } = result._source; // todo: update

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <ListItemButton component="a">
                    <ToolWrapper
                        disableTypography
                        primary={
                            <ToolTitleWrapper>
                                <ToolTitle>
                                    <EllipsisLineLimit
                                        text={name || ""}
                                        showToolTip
                                        maxLine={1}
                                    />
                                </ToolTitle>
                            </ToolTitleWrapper>
                        }
                        secondary={
                            <ToolDescription
                                maxLine={2}
                                text={description || t("notAvailable")}
                            />
                        }
                    />
                </ListItemButton>
            </ListItem>
            <Divider component="li" />
        </>
    );
};

export default ResultCardTool;
