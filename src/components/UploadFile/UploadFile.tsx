import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BoxProps, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { FileUpload } from "@/interfaces/FileUpload";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { convertBase64 } from "@/utils/file";
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
    apiPath: string;
    allowReuploading?: boolean;
    acceptedFileTypes?: string;
    fileSelectButtonText?: string;
    onFileUploaded: (fileId: number) => void;
    isUploading?: Dispatch<SetStateAction<boolean>>;
    onBeforeUploadCheck?: (event: Event & EventUploadedImage) => boolean;
    onFileCheckFailed?: () => void;
    onFileCheckSucceeded?: (response: FileUpload) => void;
    onFileChange?: () => void;
    sx?: BoxProps["sx"];
}

const TRANSLATION_PATH = "components.UploadFile";

const UploadFile = ({
    apiPath,
    allowReuploading,
    acceptedFileTypes = ".xslx",
    fileSelectButtonText,
    onFileUploaded,
    isUploading,
    onBeforeUploadCheck,
    onFileCheckFailed,
    onFileCheckSucceeded,
    onFileChange,
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
                    onFileUploaded(fileScanStatus?.entity_id);
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

    const onSubmit = async () => {
        if (!file) {
            return;
        }

        let shouldContinue = true;

        if (file.type.startsWith("image/")) {
            try {
                await new Promise(async (resolve, reject) => {
                    const image = new Image();
                    const base64 = await convertBase64(file);
                    image.src = base64.toString();

                    image.onload = function (e: Event) {
                        if (onBeforeUploadCheck) {
                            const checked = onBeforeUploadCheck?.apply(this, [
                                e as Event & EventUploadedImage,
                            ]);

                            checked ? resolve(null) : reject(null);
                        } else {
                            resolve(null);
                        }
                    };
                });
            } catch (_) {
                shouldContinue = false;
            }
        }

        if (shouldContinue) {
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
        } else {
            setHasError(false);

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
                                onFileChange?.();
                                setFile(file);
                            }}
                            helperText={
                                file?.name ||
                                t("uploadHelper", {
                                    fileType: acceptedFileTypes,
                                })
                            }
                        />
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            sx={{ maxWidth: 150 }}
                            disabled={!file}>
                            {t("uploadButtonText")}
                        </Button>
                    </>
                )}
                {fileId && !hasError && pollFileStatus && <Loading />}
            </Stack>
        </Form>
    );
};

export default UploadFile;
