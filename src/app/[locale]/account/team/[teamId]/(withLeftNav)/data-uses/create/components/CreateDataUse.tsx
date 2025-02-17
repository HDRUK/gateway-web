"use client";

import { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DataUse } from "@/interfaces/DataUse";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import DownloadFile from "@/components/DownloadFile";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import UploadFile from "@/components/UploadFile";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { dataUseFormFields } from "@/config/forms/dataUse";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

interface DataUseCreateProps {
    teamId: string;
}

const DATE_FIELD_NAMES = [
    "project_start_date",
    "project_end_date",
    "latest_approval_date",
    "access_date",
];

const DUR_TABLE_HEADERS = [
    "Project title",
    "Dataset(s)",
    "Organisation",
    "Approval date",
];

const DUR_TABLE_ROWS = [
    "project_title",
    "datasets",
    "organisation_name",
    "latest_approval_date",
];

const DATE_FORMAT = "DD/MM/YY";
const DATASETS_FIELD_NAME = "datasets";
const NON_GATEWAY_DATASETS_FIELD_NAME = "non_gateway_datasets";
const EMPTY_VALUE = "-";

const DataUseCreate = ({ teamId }: DataUseCreateProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataUse`
    );

    const { push } = useRouter();

    const [createdDurId, setCreatedDurId] = useState<number>();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const { data: durContent } = useGet<DataUse[]>(
        `${apis.dataUseV1Url}/${createdDurId}`,
        {
            shouldFetch: !!createdDurId,
        }
    );

    const durValues = useMemo(() => {
        if (!durContent?.length) {
            return undefined;
        }

        return durContent[0];
    }, [durContent]);

    const displayDataUseValue = (fieldName: string) => {
        if (DATE_FIELD_NAMES.includes(fieldName)) {
            return get(durValues, fieldName)
                ? dayjs(get(durValues, fieldName)).format(DATE_FORMAT)
                : EMPTY_VALUE;
        }

        if (fieldName === DATASETS_FIELD_NAME) {
            const datasets = get(durValues, DATASETS_FIELD_NAME);
            return datasets?.map(dataset => dataset.shortTitle).join(", ");
        }

        if (fieldName === NON_GATEWAY_DATASETS_FIELD_NAME) {
            const nonGatewayDatasets = get(
                durValues,
                NON_GATEWAY_DATASETS_FIELD_NAME
            );
            return nonGatewayDatasets?.join(", ");
        }

        return get(durValues, fieldName);
    };

    return (
        <>
            <Paper sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="h2">{t("downloadTitle")}</Typography>
                    <Typography sx={{ mb: 2 }}>{t("downloadInfo")}</Typography>

                    <DownloadFile
                        apiPath={`${apis.dataUseV1Url}/template`}
                        buttonText={t("downloadButtonText")}
                        buttonSx={{ mb: 0 }}
                    />
                </Box>
            </Paper>

            {!durContent && (
                <Paper>
                    <Box>
                        <Typography variant="h2">{t("upload")}</Typography>
                        <UploadFile
                            apiPath={`${apis.fileUploadV1Url}?entity_flag=dur-from-upload&team_id=${teamId}`}
                            onFileUploaded={(fileId: number) =>
                                setCreatedDurId(fileId)
                            }
                            isUploading={setIsUploading}
                            acceptedFileTypes=".xlsx"
                        />
                    </Box>
                </Paper>
            )}

            {durValues && !isUploading && (
                <Paper>
                    <Box sx={{ gap: 2 }}>
                        <Typography variant="h2" sx={{ mb: 2 }}>
                            {t("successMessage")}
                        </Typography>

                        <Accordion
                            variant="plain"
                            key="data-use-details"
                            sx={{ mb: 4 }}
                            heading={
                                <Table sx={{ mr: 4 }}>
                                    <TableHead>
                                        <TableRow>
                                            {DUR_TABLE_HEADERS.map(header => (
                                                <TableCell key={header}>
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {DUR_TABLE_ROWS.map(row => (
                                                <TableCell>
                                                    {displayDataUseValue(row)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            }
                            contents={dataUseFormFields
                                .filter(
                                    f =>
                                        f.sectionName !== "Related resources" &&
                                        f.sectionName !== "Keywords"
                                )
                                .map(section => (
                                    <BoxContainer>
                                        <Typography
                                            sx={{ fontWeight: "bold", p: 2 }}>
                                            {section.sectionName}
                                        </Typography>

                                        {section.fields.map(field => (
                                            <BoxContainer
                                                sx={{
                                                    gridTemplateColumns: {
                                                        desktop:
                                                            "repeat(2, 1fr)",
                                                    },
                                                    gap: 1,
                                                    p: 2,
                                                }}>
                                                <Box
                                                    sx={{
                                                        gridColumn: {
                                                            desktop: "span 1",
                                                        },
                                                        p: 0,
                                                    }}>
                                                    <Typography>
                                                        {field.label}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        gridColumn: {
                                                            desktop: "span 1",
                                                        },
                                                        p: 0,
                                                    }}>
                                                    <Typography>
                                                        {displayDataUseValue(
                                                            field.name
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </BoxContainer>
                                        ))}
                                    </BoxContainer>
                                ))}
                        />

                        <Button
                            onClick={() =>
                                push(
                                    `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_USES}?tab=DRAFT`
                                )
                            }>
                            {t("returnButtonText")}
                        </Button>
                    </Box>
                </Paper>
            )}
        </>
    );
};

export default DataUseCreate;
