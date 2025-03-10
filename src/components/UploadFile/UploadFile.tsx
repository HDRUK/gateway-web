import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useController, Control, useForm, FieldError } from "react-hook-form";
import {
    IconButton,
    List,
    ListItem,
    Stack,
    SxProps,
    Typography,
} from "@mui/material";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { FileUpload, UploadedFileMetadata } from "@/interfaces/FileUpload";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { DeleteForeverOutlinedIcon } from "@/consts/icons";
import Button from "../Button";
import FormInputWrapper from "../FormInputWrapper";
import Loading from "../Loading";
import Upload from "../Upload";

export type EventUploadedImage = {
    width: number;
    height: number;
};

type UploadFormData = {
    upload: string;
};

export interface UploadFileProps {
    apiPath?: string;
    allowReuploading?: boolean;
    acceptedFileTypes?: string;
    fileSelectButtonText?: string;
    isUploading?: Dispatch<SetStateAction<boolean>>;
    onBeforeUploadCheck?: (height: number, width: number) => boolean;
    onFileCheckFailed?: () => void;
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
}

const TRANSLATION_PATH = "components.UploadFile";

const UploadFile = ({
    apiPath,
    allowReuploading,
    acceptedFileTypes,
    fileSelectButtonText,
    isUploading,
    onBeforeUploadCheck,
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
    const existingFileArray: UploadedFileMetadata[] =
        allowMultipleFiles && Array.isArray(value) ? value : [];

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

    const imageValidation = async (file: File) => {
        try {
            await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    const image = new Image();
                    image.src = e?.target?.result as string;
                    image.onload = function () {
                        if (onBeforeUploadCheck) {
                            const checked = onBeforeUploadCheck(
                                image.height,
                                image.width
                            );
                            return checked
                                ? resolve(null)
                                : reject(
                                      new Error(
                                          "The image does not pass it's checks"
                                      )
                                  );
                        }

                        return resolve(true);
                    };
                };
            });
            return true;
        } catch (_) {
            return false;
        }
    };

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
            formControlSx={sx}
            label={label}
            required={required}
            error={error && formatErrorMessage(error, label)}>
            <Stack spacing={0}>
                {!fileId && (
                    <>
                        <Upload
                            inputRef={ref}
                            control={uploadFileControl}
                            label={fileSelectButtonText || t("upload")}
                            name="upload"
                            uploadSx={{ display: "none" }}
                            acceptFileTypes={acceptedFileTypes}
                            onFileChange={(file: File) => {
                                if (file.type.startsWith("image/")) {
                                    imageValidation(file).then(result => {
                                        setFile(file);
                                        onFileChange?.(file);
                                        if (!result) {
                                            onFileCheckFailed?.();
                                        }
                                    });
                                } else {
                                    setFile(file);
                                    onFileChange?.(file);
                                }
                            }}
                            helperText={
                                file?.name ||
                                existingFilename ||
                                (acceptedFileTypes
                                    ? t("uploadHelper", {
                                          fileType: acceptedFileTypes,
                                      })
                                    : t("uploadHelperFilesize"))
                            }
                        />

                        {showUploadButton && (
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                sx={{ maxWidth: 150 }}
                                disabled={!file}>
                                {t("uploadButtonText")}
                            </Button>
                        )}

                        {allowMultipleFiles && (
                            <List sx={{ mt: 2, mb: 2 }}>
                                {!!existingFileArray?.length &&
                                    existingFileArray?.map(file => (
                                        <ListItem
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                            <Typography
                                                sx={{
                                                    color: colors.grey600,
                                                }}>
                                                {file.filename}
                                            </Typography>
                                            <IconButton
                                                onClick={() =>
                                                    (onFileRemove &&
                                                        onFileRemove(
                                                            file.id
                                                        )) ||
                                                    undefined
                                                }>
                                                <DeleteForeverOutlinedIcon color="primary" />
                                            </IconButton>
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
