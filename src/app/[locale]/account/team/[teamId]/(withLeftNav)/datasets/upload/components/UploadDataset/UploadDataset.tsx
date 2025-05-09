"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/interfaces/FileUpload";
import Box from "@/components/Box";
import Button from "@/components/Button";
import DownloadExternalFile from "@/components/DownloadExternalFile";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import UploadFile from "@/components/UploadFile";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";

interface UploadDatasetProps {
    teamId: string;
    teamPid: string;
}

const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION;
const SCHEMA_BRANCH = process.env.NEXT_PUBLIC_SCHEMA_BRANCH || "master";
const TRANSLATION_PATH = "pages.account.team.datasets.components.UploadDataset";
const FILE_TYPE = ".json";
const FILE_DOWNLOAD_NAME = `HDRUK_${SCHEMA_VERSION}.template.json`;

const UploadDataset = ({ teamId, teamPid }: UploadDatasetProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const [errorMessage, SetErrorMessage] = useState<string>("");

    const { push } = useRouter();

    const checkIfPidMatches = (file: unknown) => {
        SetErrorMessage("");
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const jsonData = JSON.parse(event.target.result);
                const dataCustodianId =
                    jsonData.summary?.dataCustodian?.identifier;
                if (!dataCustodianId) {
                    SetErrorMessage(t("errorNoPid", { teamPid }));
                } else if (teamPid !== dataCustodianId) {
                    SetErrorMessage(
                        t("errorNoMatchingPid", { dataCustodianId, teamPid })
                    );
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };

        reader.readAsText(file);
    };

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

                    <DownloadExternalFile
                        apiPath={`https://raw.githubusercontent.com/HDRUK/schemata-2/${SCHEMA_BRANCH}/docs/HDRUK/${SCHEMA_VERSION}.template.json`}
                        buttonText={t("downloadButtonText")}
                        fileName={FILE_DOWNLOAD_NAME}
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
                            onFileChange={checkIfPidMatches}
                            isUploading={setIsUploading}
                            acceptedFileTypes={FILE_TYPE}
                            showUploadButton={errorMessage === ""}
                        />
                        {errorMessage !== "" && (
                            <Alert severity="error">{errorMessage}</Alert>
                        )}
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
