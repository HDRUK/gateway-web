import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { FileUpload } from "@/interfaces/FileUpload";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import Button from "../Button";
import Form from "../Form";
import Loading from "../Loading";
import Upload from "../Upload";

type UploadFormData = {
    upload: string;
};

interface UploadFileProps {
    apiPath: string;
    allowReuploading?: boolean;
    fileUploadedAction: (fileId: number) => void;
    isUploading: Dispatch<SetStateAction<boolean>>;
}

const TRANSLATION_PATH = "components.UploadFile";

const UploadFile = ({
    apiPath,
    allowReuploading,
    fileUploadedAction,
    isUploading,
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

        notificationService.apiError(fileScanStatus?.error || t("error"));
    };

    useEffect(() => {
        if (fileId) {
            if (fileScanStatus && fileScanStatus?.status === "PROCESSED") {
                isUploading(false);
                setPollFileStatus(false);

                if (
                    fileScanStatus?.entity_id &&
                    fileScanStatus?.entity_id > 0
                ) {
                    fileUploadedAction(fileScanStatus?.entity_id);
                } else {
                    handleError();
                }

                if (allowReuploading) {
                    setFileId(undefined);
                }
            }
        }
    }, [fileId, fileScanStatus]);

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
            isUploading(true);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={0}>
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
                {fileId && !hasError && pollFileStatus && <Loading />}
            </Stack>
        </Form>
    );
};

export default UploadFile;
