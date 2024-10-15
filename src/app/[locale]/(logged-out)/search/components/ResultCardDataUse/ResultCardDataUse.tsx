import { Divider, ListItem, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SearchResultDataUse } from "@/interfaces/Search";
import Button from "@/components/Button";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import DataUseDetailsDialog from "@/modules/DataUseDetailsDialog";
import useDialog from "@/hooks/useDialog";
import { RouteName } from "@/consts/routeName";
import {
    ResultButtonWrap,
    ResultRow,
    ResultRowCategory,
    ResultTitle,
} from "./ResultCardDataUse.styles";

interface ResultCardProps {
    result: SearchResultDataUse;
}

const TRANSLATION_PATH = "pages.search.components.ResultCard";
const TOOLTIP_SUFFIX = "Tooltip";
const CHARACTER_LIMIT = 50;

const ResultCardDataUse = ({ result }: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { push } = useRouter();
    const { showDialog } = useDialog();

    const leadOrgNames = result?.organisationName?.split(",");

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

    // eslint-disable-next-line no-underscore-dangle
    const resultId = result._id;

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <ListItemText
                    disableTypography
                    sx={{ padding: 2, paddingBottom: 1, m: 0 }}
                    primary={
                        <ResultTitle>
                            <Link
                                href={`${RouteName.DATA_USE_ITEM}/${resultId}`}
                                fontSize={16}
                                fontWeight={600}
                                marginBottom={2}>
                                <EllipsisLineLimit
                                    text={result.projectTitle || ""}
                                    showToolTip
                                />
                            </Link>
                            {((!!result.datasetTitles?.length &&
                                result.datasetTitles?.length > 1) ||
                                leadOrgNames?.length > 1) && (
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
                        </ResultTitle>
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

                                {(!!leadOrgNames && (
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                        }}>
                                        {leadOrgNames[0]}
                                        {leadOrgNames.length > 1 &&
                                            `,... (${leadOrgNames.length})`}
                                    </Typography>
                                )) ||
                                    missingDataComponent}
                            </ResultRow>

                            <ResultRow>
                                <ResultRowCategory>
                                    <TooltipIcon
                                        content={t(`datasets${TOOLTIP_SUFFIX}`)}
                                        label={t("datasets")}
                                    />
                                </ResultRowCategory>

                                {(!!result.datasetTitles?.length && (
                                    <>
                                        <ResultButtonWrap>
                                            <EllipsisCharacterLimit
                                                text={
                                                    result.datasetTitles[0] ||
                                                    ""
                                                }
                                                isButton
                                                characterLimit={CHARACTER_LIMIT}
                                                onClick={() =>
                                                    push(
                                                        `/${RouteName.DATASET_ITEM}/${result.datasetIds[0]}`
                                                    )
                                                }
                                            />
                                        </ResultButtonWrap>
                                        {result.datasetTitles?.length > 1 && (
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    ml: 1,
                                                }}>
                                                ({result.datasetTitles?.length})
                                            </Typography>
                                        )}
                                    </>
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
                                {(!!result?.team?.name && (
                                    <Link
                                        href={`${RouteName.DATA_PROVIDERS_ITEM}/${result.team.id}`}>
                                        {`${result.team?.member_of} > `}
                                        <EllipsisCharacterLimit
                                            text={
                                                "sadasd sadasd asdsad asdasd asdasd asdasdas asdasd asdasdasd"
                                            }
                                            characterLimit={CHARACTER_LIMIT}
                                        />
                                    </Link>
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
