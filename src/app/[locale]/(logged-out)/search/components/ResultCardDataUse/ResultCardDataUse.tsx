import { Divider, ListItem, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultDataUse } from "@/interfaces/Search";
import Button from "@/components/Button";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import DataUseDetailsDialog from "@/modules/DataUseDetailsDialog";
import useDialog from "@/hooks/useDialog";
import {
    ResultButtonWrap,
    ResultRow,
    ResultRowCategory,
} from "./ResultCardDataUse.styles";

interface ResultCardProps {
    result: SearchResultDataUse;
}

const TRANSLATION_PATH = "pages.search.components.ResultCard";
const TOOLTIP_SUFFIX = "Tooltip";
const CHARACTER_LIMIT = 150;

const ResultCardDataUse = ({ result }: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();

    const missingDataComponent = (
        <Typography
            sx={{
                fontWeight: 500,
            }}>
            -
        </Typography>
    );

    const handleShowAll = () => {
        showDialog(DataUseDetailsDialog, { result });
    };

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <ListItemText
                    disableTypography
                    sx={{ padding: 2, paddingBottom: 1, m: 0 }}
                    primary={
                        <Link
                            href="/#"
                            fontSize={16}
                            fontWeight={600}
                            marginBottom={2}>
                            <EllipsisLineLimit
                                text={result.projectTitle || ""}
                                showToolTip
                            />
                        </Link>
                    }
                    primaryTypographyProps={{
                        color: "primary",
                        fontWeight: 600,
                        fontSize: 16,
                        mb: 1.5,
                    }}
                    secondary={
                        <>
                            <ResultRow>
                                <ResultRowCategory>
                                    <TooltipIcon
                                        content={t(
                                            `leadOrganisation${TOOLTIP_SUFFIX}`
                                        )}
                                        label={t("leadOrganisation")}
                                    />
                                </ResultRowCategory>

                                <Typography
                                    sx={{
                                        fontWeight: 500,
                                    }}>
                                    {result.organisationName}
                                </Typography>
                            </ResultRow>

                            <ResultRow>
                                <ResultRowCategory>
                                    <TooltipIcon
                                        content={t(`datasets${TOOLTIP_SUFFIX}`)}
                                        label={t("datasets")}
                                    />
                                </ResultRowCategory>

                                {(!!result.datasetTitles?.length && (
                                    <ResultButtonWrap>
                                        <EllipsisCharacterLimit
                                            text={result.datasetTitles[0] || ""}
                                            isButton
                                            characterLimit={CHARACTER_LIMIT}
                                        />

                                        {result.datasetTitles.length > 1 && (
                                            <Button
                                                onClick={handleShowAll}
                                                size="small"
                                                variant="outlined"
                                                color="secondary">
                                                {t("showAll")}
                                            </Button>
                                        )}
                                    </ResultButtonWrap>
                                )) ||
                                    missingDataComponent}
                            </ResultRow>

                            <ResultRow>
                                <ResultRowCategory>
                                    <TooltipIcon
                                        content={t(
                                            `dataCustodian${TOOLTIP_SUFFIX}`
                                        )}
                                        label={t("dataCustodian")}
                                    />
                                </ResultRowCategory>
                                {(!!result?.team?.name &&
                                    result.datasetTitles[0] && (
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                            }}>
                                            {`${result.team?.member_of} > `}
                                            <EllipsisCharacterLimit
                                                text={result.team.name}
                                                characterLimit={CHARACTER_LIMIT}
                                            />
                                        </Typography>
                                    )) ||
                                    missingDataComponent}
                            </ResultRow>
                        </>
                    }
                />
            </ListItem>
            <Divider component="li" />
        </>
    );
};

export default ResultCardDataUse;
