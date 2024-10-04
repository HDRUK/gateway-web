import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BoxProps, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { StructuralMetadata } from "@/interfaces/Dataset";
import { FileUpload } from "@/interfaces/FileUpload";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import Button from "../Button";
import Form from "../Form";
import Loading from "../Loading";
import Upload from "../Upload";

export type EventUploadedImage = {
    width: number;
    height: number;
};

type UploadFormData = {
    upload: string;
};

interface UploadFileProps {
    apiPath?: string;
    allowReuploading?: boolean;
    acceptedFileTypes?: string;
    fileSelectButtonText?: string;
    onFileUploaded?: (uploadResponse?: number | StructuralMetadata[]) => void;
    isUploading?: Dispatch<SetStateAction<boolean>>;
    onBeforeUploadCheck?: (height: number, width: number) => boolean;
    onFileCheckFailed?: () => void;
    onFileCheckSucceeded?: (response: FileUpload) => void;
    onFileChange?: (file: File) => void;
    showUploadButton?: boolean;
    sx?: BoxProps["sx"];
}

const TRANSLATION_PATH = "components.UploadFile";

const UploadFile = ({
    apiPath,
    allowReuploading,
    acceptedFileTypes = ".xlsx",
    fileSelectButtonText,
    onFileUploaded,
    isUploading,
    onBeforeUploadCheck,
    onFileCheckFailed,
    onFileCheckSucceeded,
    onFileChange,
    showUploadButton = true,
    sx,
}: UploadFileProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const [file, setFile] = useState<File>();
    const [fileId, setFileId] = useState<number>();
    const [pollFileStatus, setPollFileStatus] = useState<boolean>(false);
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
    };

    useEffect(() => {
        if (fileId) {
            if (fileScanStatus && fileScanStatus?.status === "PROCESSED") {
                isUploading?.(false);
                setPollFileStatus(false);

                if (
                    fileScanStatus?.entity_id &&
                    fileScanStatus?.entity_id > 0
                ) {
                    onFileUploaded?.(fileScanStatus?.entity_id);
                } else if (fileScanStatus?.structural_metadata) {
                    onFileUploaded?.(fileScanStatus?.structural_metadata);
                } else {
                    handleError();
                }

                if (allowReuploading) {
                    setFileId(undefined);
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

    return (
        <Form sx={sx}>
            <Stack spacing={0}>
                {!fileId && (
                    <>
                        <Upload
                            control={control}
                            label={fileSelectButtonText || t("upload")}
                            name="upload"
                            uploadSx={{ display: "none" }}
                            acceptFileTypes={acceptedFileTypes}
                            onFileChange={(file: File) => {
                                if (file.type.startsWith("image/")) {
                                    imageValidation(file).then(result => {
                                        if (result) {
                                            setFile(file);
                                            onFileChange?.(file);
                                        } else {
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
                                t("uploadHelper", {
                                    fileType: acceptedFileTypes,
                                })
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
                    </>
                )}
                {fileId && !hasError && pollFileStatus && <Loading />}
            </Stack>
        </Form>
    );
};

export default UploadFile;
