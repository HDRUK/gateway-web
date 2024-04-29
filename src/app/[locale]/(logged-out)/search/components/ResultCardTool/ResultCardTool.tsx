import { Divider, ListItem, ListItemButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultTool } from "@/interfaces/Search";
import Button from "@/components/Button";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import ToolDetailsDialog from "@/modules/ToolDetailsDialog";
import useDialog from "@/hooks/useDialog";
import {
    ToolWrapper,
    ToolTitle,
    ToolTitleWrapper,
    ToolDescription,
} from "./ResultCardTool.styles";

interface ResultCardToolProps {
    result: SearchResultTool;
}

const TRANSLATION_PATH = "pages.search.components.ResultCardTool";

const ResultCardTool = ({ result }: ResultCardToolProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { showDialog } = useDialog();

    const handleShowAll = () => {
        showDialog(ToolDetailsDialog, { result });
    };

    const { name, description } = result; // todo: update with keywords

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
                                {description && (
                                    <Button
                                        onClick={handleShowAll}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        style={{
                                            flexShrink: 0,
                                            alignSelf: "flex-start",
                                        }}>
                                        {t("showAll")}
                                    </Button>
                                )}
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
