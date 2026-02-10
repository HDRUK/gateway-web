"use client";

import { Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { createColumnHelper } from "@tanstack/react-table";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { SearchCategory, SearchResultDataset } from "@/interfaces/Search";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Table from "@/components/Table";
import useDialog from "@/hooks/useDialog";
import theme from "@/config/theme";
import { OpenInNewIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { getPopulationSize } from "@/utils/search";

const TRANSLATION_PATH = "modules.dialogs.CohortDiscoveryDatasets";
const PUBLISHER_NAME_PATH = "metadata.summary.publisher.name";
const CURRENT_DOMAIN = process.env.NEXT_PUBLIC_GATEWAY_URL;

interface CohortDiscoveryDatasetsDialogProps {
    data: SearchResultDataset[];
}

const CohortDiscoveryDatasetsDialog = ({
    data,
}: CohortDiscoveryDatasetsDialogProps) => {
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    const columnHelper = createColumnHelper<SearchResultDataset>();

    const renderTableHeader = (headerText: string) => (
        <Typography
            sx={{
                textAlign: "left",
                fontWeight: "bold",
                backgroundColor: theme.palette.grey[50],
                p: 1,
            }}>
            {headerText}
        </Typography>
    );

    const getColumns = (translations: { [id: string]: string }) => {
        return [
            columnHelper.display({
                id: "dataset",
                cell: ({ row: { original } }) => {
                    const { _id: datasetId } = original;
                    const linkHref = `/${RouteName.DATASET_ITEM}/${datasetId}`;

                    return (
                        <Link href={linkHref}>
                            <EllipsisLineLimit
                                text={get(original, "metadata.summary.title")}
                                maxLine={1}
                                component="span"
                            />
                        </Link>
                    );
                },
                header: () => renderTableHeader(t("dataset")),
                size: 130,
            }),

            columnHelper.display({
                id: "dataProvider",
                cell: ({ row: { original } }) => (
                    <EllipsisLineLimit
                        text={get(original, PUBLISHER_NAME_PATH)}
                    />
                ),
                header: () => renderTableHeader(t("custodian")),
                size: 120,
            }),

            {
                id: "population_size",
                cell: ({ row: { original } }) => {
                    return (
                        <Typography>
                            {getPopulationSize(
                                original?.metadata,
                                translations.populationSizeNotReported
                            )}
                        </Typography>
                    );
                },
                header: () => renderTableHeader(t("populationSize.label")),
                size: 50,
                meta: {},
            },
        ];
    };

    const translations = {
        populationSizeLabel: t("populationSize.label"),
        populationSizeTooltip: t("populationSize.tooltip"),
        populationSizeNotReported: t("populationSize.notReported"),
    };

    return (
        <Dialog title={t("title")} maxWidth="laptop">
            <MuiDialogContent
                sx={{
                    display: "flex",
                    mt: 3,
                    justifyContent: "center",
                }}>
                {!data && <Loading />}
                {data && (
                    <Table<SearchResultDataset>
                        columns={getColumns(translations)}
                        rows={data}
                        style={{
                            border: `1px solid ${theme.palette.greyCustom.main}`,
                            borderBottom: 0,
                            borderSpacing: 0,
                            width: "100%",
                            "& th": {
                                padding: 0,
                            },
                        }}
                    />
                )}
            </MuiDialogContent>
            <MuiDialogActions
                sx={{ p: 3, pt: 1, justifyContent: "flex-start" }}>
                <Button onClick={() => hideDialog()}>{t("closeButton")}</Button>
                <Button
                    href={`${CURRENT_DOMAIN}/${RouteName.SEARCH}?type=${SearchCategory.DATASETS}&isCohortDiscovery=isCohortDiscovery`}
                    variant="outlined"
                    color="secondary"
                    target="_blank"
                    endIcon={<OpenInNewIcon />}>
                    {t("viewMoreButton")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default CohortDiscoveryDatasetsDialog;
