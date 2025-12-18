import { Dispatch, SetStateAction, useState } from "react";
import { useController, Control } from "react-hook-form";
import { FileDownload } from "@mui/icons-material";
import PublishIcon from "@mui/icons-material/Publish";
import { Divider, Grid, IconButton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import {
    FileUpload,
    UploadedFileMetadata,
    UploadedFileMetadataValue,
} from "@/interfaces/FileUpload";
import apis from "@/config/apis";
import theme from "@/config/theme";
import { DeleteForeverOutlinedIcon, ReUploadIcon } from "@/consts/icons";
import Box from "../Box";
import Button from "../Button";
import HTMLContent from "../HTMLContent";
import Link from "../Link";
import Typography from "../Typography";
import UploadFile from "../UploadFile";

export type EventUploadedImage = {
    width: number;
    height: number;
};

export type UploadFormData = {
    upload: object;
};

export interface DocumentExchangeProps {
    apiPath: string;
    allowReuploading?: boolean;
    acceptedFileTypes?: string;
    isUploading?: Dispatch<SetStateAction<boolean>>;
    onFileCheckSucceeded?: (response: FileUpload) => void;
    onFileChange?: (file: File) => void;
    onFileUploaded?: (uploadResponse?: FileUpload) => void;
    onFileUploadError?: () => void;
    onFileRemove?: (fileId: number) => void;
    showUploadButton?: boolean;
    triggerFileUpload?: boolean;
    label?: string;
    required?: boolean;
    name?: string;
    control: Control;
    allowMultipleFiles?: boolean;
    disabled?: boolean;
    fileDownloadApiPath?: string;
    hideUpload?: boolean;
    skipImageValidation?: boolean;
    onFocus?: () => void;
    info?: string;
    preview?: boolean;
    document?: UploadedFileMetadata;
    guidance?: string;
}

const TRANSLATION_PATH = "components.DocumentExchange";

const DocumentExchange = ({
    apiPath,
    allowReuploading,
    acceptedFileTypes,
    isUploading,
    onFileCheckSucceeded,
    onFileChange,
    onFileUploaded,
    onFileUploadError,
    onFileRemove,
    showUploadButton = true,
    triggerFileUpload,
    label = "",
    required,
    name = "upload",
    control,
    allowMultipleFiles,
    disabled = false,
    fileDownloadApiPath,
    hideUpload = false,
    skipImageValidation = false,
    onFocus,
    info,
    preview = false,
    document,
    guidance,
}: DocumentExchangeProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const currentControl = control;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control: currentControl,
    });

    const value = fieldProps.value?.value;

    const [existingUploadedFile, setExistingUploadedFile] = useState<
        UploadedFileMetadataValue | undefined
    >(value);

    const [state, setState] = useState<string>("INITIAL");

    const renderExistingDownload = () => {
        if (!existingUploadedFile) {
            return;
        }

        return (
            <Box sx={{ mb: 1, p: 0 }} key={existingUploadedFile.uuid}>
                {fileDownloadApiPath ? (
                    <Link
                        href={`${fileDownloadApiPath}/${existingUploadedFile.uuid}/download`}
                        sx={{ pt: 1, pb: 1 }}>
                        {existingUploadedFile.filename}
                    </Link>
                ) : (
                    <Typography sx={{ pt: 1, pb: 1 }}>
                        {existingUploadedFile.filename}
                    </Typography>
                )}
                {onFileRemove && (
                    <IconButton
                        aria-label={`Remove file ${existingUploadedFile.filename}`}
                        onClick={() => {
                            onFileRemove(existingUploadedFile.uuid);
                            setExistingUploadedFile(undefined);
                        }}>
                        <DeleteForeverOutlinedIcon color="primary" />
                    </IconButton>
                )}
                <Divider sx={{ pt: 1 }} />
            </Box>
        );
    };

    if (hideUpload) {
        return (
            <Stack spacing={0} sx={{ mt: 3 }}>
                <Typography variant="h2">{label}</Typography>
                {guidance && <HTMLContent content={guidance} />}

                <Divider sx={{ mt: 1, mb: 2 }} />

                {renderExistingDownload()}
            </Stack>
        );
    }

    return (
        <Stack spacing={0} sx={{ mt: 3 }}>
            <Typography variant="h2">{label}</Typography>
            {guidance && <HTMLContent content={guidance} />}

            <Divider sx={{ mt: 1, mb: 2 }} />

            {renderExistingDownload()}

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {document && (
                    <Grid
                        sx={{ p: 0 }}
                        size={{
                            mobile: 12,
                            tablet: 12,
                            laptop: 3,
                            desktop: 3,
                        }}>
                        <Typography fontWeight={600}>Download</Typography>
                        <Typography fontSize={13}>
                            Download the form, you can re-download anytime if
                            needed.
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Button
                            startIcon={<FileDownload color="primary" />}
                            variant="text"
                            href={`${apis.fileProcessedV1Url}/${document.value.uuid}/download`}>
                            Download
                        </Button>
                    </Grid>
                )}

                <Grid
                    sx={{ p: 0 }}
                    size={{
                        mobile: 4,
                        tablet: 6,
                        laptop: 3,
                        desktop: 3,
                    }}>
                    <Typography fontWeight={600}>
                        {!existingUploadedFile ? "Upload" : "Re-upload"}
                    </Typography>
                    <Typography fontSize={13}>
                        {!existingUploadedFile
                            ? "Upload your completed form as part of your application."
                            : "Re-upload form template here to replace existing file"}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Button
                        startIcon={
                            !existingUploadedFile ? (
                                <PublishIcon color="primary" />
                            ) : (
                                <ReUploadIcon sx={{ width: 16 }} />
                            )
                        }
                        variant="text"
                        onClick={() => setState("UPLOAD")}>
                        {!existingUploadedFile ? "Upload" : "Re-upload"}
                    </Button>
                </Grid>

                {state === "UPLOAD" && (
                    <Grid
                        sx={{ pb: 2 }}
                        size={{
                            mobile: 8,
                            tablet: 6,
                            laptop: 3,
                            desktop: 3,
                        }}>
                        <Box
                            sx={{
                                borderLeft: `1px solid ${theme.palette.grey[300]}`,
                            }}>
                            <UploadFile
                                apiPath={apiPath}
                                allowReuploading={allowReuploading}
                                acceptedFileTypes={acceptedFileTypes}
                                control={control}
                                fileSelectButtonText="Select file"
                                label={undefined}
                                required={required}
                                name={name}
                                allowMultipleFiles={allowMultipleFiles}
                                disabled={disabled}
                                fileDownloadApiPath={fileDownloadApiPath}
                                skipImageValidation={skipImageValidation}
                                info={info}
                                isUploading={isUploading}
                                onFileCheckSucceeded={onFileCheckSucceeded}
                                onFileChange={onFileChange}
                                onFileUploaded={(file: File) => {
                                    onFileUploaded && onFileUploaded(file);
                                    setExistingUploadedFile(file);
                                }}
                                onFileUploadError={onFileUploadError}
                                showUploadButton={showUploadButton}
                                triggerFileUpload={triggerFileUpload}
                                hideUpload={hideUpload}
                                onFocus={onFocus}
                                preview={preview}
                                document={document}
                                hideExistingFiles={true}
                            />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Stack>
    );
};

export default DocumentExchange;
