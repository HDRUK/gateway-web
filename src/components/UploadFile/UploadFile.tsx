import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useController, Control, useForm, FieldError } from "react-hook-form";
import { IconButton, List, ListItem, Stack, SxProps } from "@mui/material";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { FileUpload, UploadedFileMetadata } from "@/interfaces/FileUpload";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { DeleteForeverOutlinedIcon } from "@/consts/icons";
import { ImageValidationError } from "@/consts/image";
import { validateImageDimensions } from "@/utils/imageValidation";
import Button from "../Button";
import FormInputWrapper from "../FormInputWrapper";
import Link from "../Link";
import Loading from "../Loading";
import Typography from "../Typography";
import Upload from "../Upload";

export type EventUploadedImage = {
    width: number;
    height: number;
};

export type UploadFormData = {
    upload: object;
};

export interface UploadFileProps {
    apiPath?: string;
    allowReuploading?: boolean;
    acceptedFileTypes?: string;
    fileSelectButtonText?: string;
    isUploading?: Dispatch<SetStateAction<boolean>>;
    onFileCheckFailed?: (reason?: ImageValidationError) => void;
    onFileCheckSucceeded?: (response: FileUpload) => void;
    onFileChange?: (file: File) => void;
    onFileUploaded?: (uploadResponse?: FileUpload) => void;
    onFileUploadError?: () => void;
    onFileRemove?: (fileId: number) => void;
    showUploadButton?: boolean;
    triggerFileUpload?: boolean;
    sx?: SxProps;
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
}

const TRANSLATION_PATH = "components.UploadFile";

const UploadFile = ({
    apiPath,
    allowReuploading,
    acceptedFileTypes,
    fileSelectButtonText,
    isUploading,
    onFileCheckFailed,
    onFileCheckSucceeded,
    onFileChange,
    onFileUploaded,
    onFileUploadError,
    onFileRemove,
    showUploadButton = true,
    triggerFileUpload,
    sx,
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
}: UploadFileProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const [file, setFile] = useState<File>();
    const [fileId, setFileId] = useState<number>();
    const [pollFileStatus, setPollFileStatus] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>();

    const { handleSubmit, control: uploadFileControl } =
        useForm<UploadFormData>({
            defaultValues: {
                upload: "",
            },
        });

    const currentControl = control || uploadFileControl;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control: currentControl,
    });

    const value = fieldProps.value?.value;
    const existingFilename = !allowMultipleFiles && value?.filename;

    const existingFileArray: UploadedFileMetadata[] = [].concat(value || []);

    const { data: fileScanStatus } = useGet<FileUpload>(
        `${apis.fileUploadV1Url}/${fileId}`,
        {
            shouldFetch: pollFileStatus,
            refreshInterval: 1000,
        }
    );

    const uploadFile = usePost(apiPath, {
        successNotificationsOn: false,
    });

    const handleError = () => {
        setHasError(true);
        setFileId(undefined);
        setFile(undefined);
        isUploading?.(false);
        setPollFileStatus(false);

        notificationService.apiError(fileScanStatus?.error || t("error"));

        if (onFileUploadError) {
            onFileUploadError();
        }
    };

    useEffect(() => {
        if (fileId) {
            if (fileScanStatus && fileScanStatus?.status === "PROCESSED") {
                isUploading?.(false);
                setPollFileStatus(false);

                if (
                    apiPath?.includes("media") ||
                    (fileScanStatus?.entity_id &&
                        fileScanStatus?.entity_id > 0) ||
                    fileScanStatus?.structural_metadata
                ) {
                    onFileUploaded?.(fileScanStatus);
                } else {
                    handleError();
                }

                if (allowReuploading) {
                    setFileId(undefined);
                    setFile(undefined);
                }

                if (allowMultipleFiles) {
                    setFile(undefined);
                }
            }
            if (fileScanStatus && fileScanStatus?.status === "FAILED") {
                handleError();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileId, fileScanStatus]);

    const onSubmit = async () => {
        if (!file) {
            return;
        }

        try {
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
                isUploading?.(true);
            }
            onFileCheckSucceeded?.(uploadedFileStatus);
        } catch {
            setHasError(true);
            onFileCheckFailed?.();
        }
    };

    useEffect(() => {
        if (triggerFileUpload) {
            handleSubmit(onSubmit)();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerFileUpload]);

    const formatErrorMessage = (
        uploadError: FieldError,
        fieldName: string
    ): FieldError | undefined => {
        if (typeof uploadError !== "object") {
            return uploadError;
        }

        const filenameError = allowMultipleFiles
            ? (get(uploadError, "value") as unknown as FieldError)
            : (get(uploadError, "value.filename") as unknown as FieldError);

        if (filenameError) {
            return {
                type: filenameError.type,
                message: filenameError?.message?.replace(
                    /^.*?(?=\s(?:is|should))/,
                    fieldName
                ),
            };
        }

        return undefined;
    };

    return (
        <FormInputWrapper
            disabled={disabled}
            formControlSx={sx}
            label={label}
            required={required}
            name={name}
            error={error && formatErrorMessage(error, label)}>
            <Stack spacing={0}>
                {!fileId && (
                    <>
                        {!hideUpload && (
                            <Upload
                                inputRef={ref}
                                disabled={disabled}
                                control={uploadFileControl}
                                label={fileSelectButtonText || t("upload")}
                                name={name}
                                acceptFileTypes={acceptedFileTypes}
                                onFileChange={async (file: File) => {
                                    if (!file) {
                                        return;
                                    }

                                    if (
                                        !skipImageValidation &&
                                        file.type.startsWith("image/")
                                    ) {
                                        validateImageDimensions(file)
                                            .then(() => {
                                                setFile(file);
                                                onFileChange?.(file);
                                            })
                                            .catch(
                                                (
                                                    reason: ImageValidationError
                                                ) => {
                                                    onFileCheckFailed?.(reason);
                                                }
                                            );
                                    } else {
                                        setFile(file);
                                        onFileChange?.(file);
                                    }
                                }}
                                helperText={
                                    file?.name ||
                                    (acceptedFileTypes
                                        ? t("uploadHelper", {
                                              fileType: acceptedFileTypes,
                                          })
                                        : t("uploadHelperFilesize"))
                                }
                                fileName={file?.name || existingFilename}
                                fileDownloadApiPath={fileDownloadApiPath}
                                onFocus={() => onFocus && onFocus()}
                            />
                        )}
                        {showUploadButton && !hideUpload && (
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                sx={{ maxWidth: 150 }}
                                disabled={!file}>
                                {t("uploadButtonText")}
                            </Button>
                        )}

                        {!!existingFileArray?.length && (
                            <List sx={{ mt: 2, mb: 1 }}>
                                {existingFileArray?.map(file => (
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            pl: 0,
                                            pb: 0,
                                        }}
                                        key={file.id}>
                                        {fileDownloadApiPath ? (
                                            <Link
                                                href={`${fileDownloadApiPath}/${file.id}/download`}
                                                sx={{ pt: 1, pb: 1 }}>
                                                {file.filename}
                                            </Link>
                                        ) : (
                                            <Typography sx={{ pt: 1, pb: 1 }}>
                                                {file.filename}
                                            </Typography>
                                        )}
                                        {onFileRemove && (
                                            <IconButton
                                                aria-label={`Remove file ${file.filename}`}
                                                onClick={() =>
                                                    onFileRemove(file.id)
                                                }>
                                                <DeleteForeverOutlinedIcon color="primary" />
                                            </IconButton>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </>
                )}
                {fileId && !hasError && pollFileStatus && <Loading />}
            </Stack>
        </FormInputWrapper>
    );
};

export default UploadFile;
