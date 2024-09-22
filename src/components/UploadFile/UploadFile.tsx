import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
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

type UploadFormData = {
    upload: string;
};

interface UploadFileProps {
    apiPath: string;
    allowReuploading?: boolean;
    acceptedFileTypes?: string;
    fileUploadedAction: (
        uploadResponse?: number | StructuralMetadata[]
    ) => void;
    isUploading: Dispatch<SetStateAction<boolean>>;
    helperText?: boolean;
    label?: string;
    setIsInvalidImage: (isNotValid: boolean) => void;
}

const TRANSLATION_PATH = "components.UploadFile";

const UploadFile = ({
    apiPath,
    allowReuploading,
    acceptedFileTypes = ".xlsx",
    fileUploadedAction,
    isUploading,
    helperText = true,
    label = "upload",
    setIsInvalidImage = () => false
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
        isUploading(false);
        setPollFileStatus(false);
        notificationService.apiError(fileScanStatus?.error || t("error"));
    };

    const imageValidation = (file: File) => {
        let result;
        if(acceptedFileTypes != ".png"){
            result = true;
        } else {
          const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                const image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    const height = this.height;
                    const width = this.width;
                    const imageRatio = width/height;
                    if (height != 350 || width != 700) {
                      setIsInvalidImage(true);
                      result = false;
                    }
                    result = true;
                  };
            }
        }
        return result;
    }

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
                } else if (fileScanStatus?.structural_metadata) {
                    fileUploadedAction(fileScanStatus?.structural_metadata);
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

        // if(acceptedFileTypes === ".png"){
            
       
        // }

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
                            label={t(label)}
                            name="upload"
                            uploadSx={{ display: "none" }}
                            acceptFileTypes={acceptedFileTypes}
                            onFileChange={(file: File) => {
                                !!imageValidation(file) && setFile(file)
                            }}
                            helperText={helperText && (
                                file?.name ||
                                t("uploadHelper", {
                                    fileType: acceptedFileTypes,
                                }))
                            }
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
