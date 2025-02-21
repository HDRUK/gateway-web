"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/interfaces/FileUpload";
import Box from "@/components/Box";
import Button from "@/components/Button";
import DownloadFile from "@/components/DownloadFile";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import UploadFile from "@/components/UploadFile";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";

interface UploadDatasetProps {
    teamId: string;
}

const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION;
const SCHEMA_BRANCH = process.env.NEXT_PUBLIC_SCHEMA_BRANCH || "master";
const TRANSLATION_PATH = "pages.account.team.datasets.components.UploadDataset";
const FILE_TYPE = ".json";
const FILE_DOWNLOAD_NAME = `HDRUK_${SCHEMA_VERSION}.template.json`;

const UploadDataset = ({ teamId }: UploadDatasetProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { push } = useRouter();

    const [createdDatasetId, setCreatedDatasetId] = useState<number>();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const FILE_UPLOAD_URL = `${apis.fileUploadV1Url}?entity_flag=dataset-from-upload&team_id=${teamId}`;
    const REDIRECT_URL = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}?tab=DRAFT`;

    return (
        <>
            <Paper sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="h2">{t("downloadTitle")}</Typography>
                    <Typography sx={{ mb: 2 }}>{t("downloadInfo")}</Typography>

                    <DownloadFile
                        apiPath={`https://raw.githubusercontent.com/HDRUK/schemata-2/${SCHEMA_BRANCH}/docs/HDRUK/${SCHEMA_VERSION}.template.json`}
                        buttonText={t("downloadButtonText")}
                        buttonSx={{ mb: 0 }}
                        isExternalFile
                        externalFileName={FILE_DOWNLOAD_NAME}
                    />
                </Box>
            </Paper>

            {!createdDatasetId && (
                <Paper>
                    <Box>
                        <Typography variant="h2">{t("upload")}</Typography>
                        <UploadFile
                            apiPath={FILE_UPLOAD_URL}
                            onFileUploaded={(file: FileUpload) =>
                                setCreatedDatasetId(file.id)
                            }
                            isUploading={setIsUploading}
                            acceptedFileTypes={FILE_TYPE}
                        />
                    </Box>
                </Paper>
            )}

            {createdDatasetId && !isUploading && (
                <Paper>
                    <Box sx={{ gap: 2 }}>
                        <Typography variant="h2" sx={{ mb: 2 }}>
                            {t("successMessage")}
                        </Typography>

                        <Button onClick={() => push(REDIRECT_URL)}>
                            {t("returnButtonText")}
                        </Button>
                    </Box>
                </Paper>
            )}
        </>
    );
};

export default UploadDataset;
