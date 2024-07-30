"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Stack,
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
import { FileUpload } from "@/interfaces/FileUpload";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Loading from "@/components/Loading";
import Typography from "@/components/Typography";
import Upload from "@/components/Upload";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
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

type UploadFormData = {
    upload: string;
};

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

    const [file, setFile] = useState<File>();
    const [fileId, setFileId] = useState<number>();
    const [pollFileStatus, setPollFileStatus] = useState<boolean>(false);
    const [createdDurId, setCreatedDurId] = useState<number>();
    const [hasError, setHasError] = useState<boolean>();

    const { handleSubmit, control } = useForm<UploadFormData>({
        defaultValues: {
            upload: "",
        },
    });

    const { data: fileScanStatus } = useGet<FileUpload>(
        `${apis.fileUploadV1Url}/${fileId}`,
        {
            shouldFetch: pollFileStatus,
            refreshInterval: 1000,
        }
    );

    const { data: durContent } = useGet<DataUse[]>(
        `${apis.dataUseV1Url}/${createdDurId}`,
        {
            shouldFetch: !!createdDurId,
        }
    );

    const uploadFile = usePost(
        `${apis.fileUploadV1Url}?entity_flag=dur-from-upload&team_id=${teamId}`,
        {
            successNotificationsOn: false,
        }
    );

    const handleError = () => {
        setHasError(true);
        setFileId(undefined);
        setFile(undefined);

        notificationService.apiError(fileScanStatus?.error || t("error"));
    };

    const onSubmit = async () => {
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const uploadedFileStatus = (await uploadFile(formData).catch(() =>
            handleError()
        )) as FileUpload;

        setHasError(false);

        if (uploadedFileStatus) {
            const fileId = uploadedFileStatus.id;

            setFileId(fileId);
            setPollFileStatus(true);
        }
    };

    useEffect(() => {
        if (fileId) {
            if (fileScanStatus && fileScanStatus?.status === "PROCESSED") {
                setPollFileStatus(false);

                if (
                    fileScanStatus?.entity_id &&
                    fileScanStatus?.entity_id > 0
                ) {
                    setCreatedDurId(fileScanStatus?.entity_id);
                } else {
                    handleError();
                }
            }
        }
    }, [fileId, fileScanStatus]);

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
            const nonGatewayDatasets = get(
                durValues,
                NON_GATEWAY_DATASETS_FIELD_NAME
            );

            return datasets ? nonGatewayDatasets : EMPTY_VALUE;
        }

        return get(durValues, fieldName);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={0} sx={{ p: 2, pt: 0 }}>
                {!fileId && (
                    <>
                        <Upload
                            control={control}
                            label={t("upload")}
                            name="upload"
                            uploadSx={{ display: "none" }}
                            acceptFileTypes=".xlsx"
                            onFileChange={(file: File) => setFile(file)}
                            helperText={file?.name || t("uploadHelper")}
                        />
                        <Button
                            type="submit"
                            sx={{ maxWidth: 150 }}
                            disabled={!file}>
                            {t("uploadButtonText")}
                        </Button>
                    </>
                )}
                {fileId && !durContent && !hasError && <Loading />}
            </Stack>

            {durValues && !hasError && (
                <Box sx={{ gap: 2 }}>
                    <Typography sx={{ ml: 2, mb: 2 }} fontWeight="bold">
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
                                                    desktop: "repeat(2, 1fr)",
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
                                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_USES}`
                            )
                        }>
                        {t("returnButtonText")}
                    </Button>
                </Box>
            )}
        </Form>
    );
};

export default DataUseCreate;
