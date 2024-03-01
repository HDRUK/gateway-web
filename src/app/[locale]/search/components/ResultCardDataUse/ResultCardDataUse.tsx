import { Divider, ListItem, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResultDataUse } from "@/interfaces/Search";
import Button from "@/components/Button";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Tooltip from "@/components/Tooltip";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
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

    const missingDataComponent = (
        <Typography
            sx={{
                fontWeight: 500,
            }}>
            -
        </Typography>
    );

    const truncateWrapper = (text: string, isButton?: boolean) => {
        const textElement = (text: string) =>
            isButton ? <Button size="small">{text}</Button> : <>{text}</>;

        if (text.length < CHARACTER_LIMIT) {
            return textElement(text);
        } else {
            const truncatedText = `${text.slice(0, CHARACTER_LIMIT)}...`;
            return (
                <Tooltip style={{ display: "inline" }} title={text}>
                    {textElement(truncatedText)}
                </Tooltip>
            );
        }
    };

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <ListItemText
                    disableTypography
                    sx={{ padding: 2, paddingBottom: 1, m: 0 }}
                    primary={
                        <Link
                            href={`/#`}
                            fontSize={16}
                            fontWeight={600}
                            marginBottom={2}>
                            <EllipsisLineLimit
                                text={result.projectTitle || ""}
                                showToolTip={true}
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
                                        {truncateWrapper(
                                            result.datasetTitles[0] || "",
                                            true
                                        )}

                                        {result.datasetTitles.length > 1 && (
                                            <Button
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
                                            {truncateWrapper(result.team.name)}
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
