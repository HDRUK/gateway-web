import { useEffect, useState } from "react";
import { SxProps } from "@mui/material";
import { FileExport } from "@/interfaces/FileExport";
import Button from "@/components/Button";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import { DownloadIcon } from "@/consts/icons";
import { downloadExternalFile, downloadFile } from "@/utils/download";

interface DownloadFileProps {
    apiPath: string;
    buttonText: string;
    isExternalFile?: boolean;
    externalFileName?: string;
    buttonSx?: SxProps;
}

const DownloadFile = ({
    apiPath,
    buttonText,
    isExternalFile,
    externalFileName,
    buttonSx,
}: DownloadFileProps) => {
    const [shouldFetch, setShouldFetch] = useState(false);

    const download = useGet<FileExport>(apiPath, {
        shouldFetch,
    });

    const handleExternalFileDownload = async () => {
        if (!externalFileName) {
            return;
        }
        const response = await fetch(apiPath);
        if (!response.ok) {
            notificationService.apiError("Failed to download file");
            return;
        }

        downloadExternalFile(response, externalFileName);
    };

    useEffect(() => {
        if (!shouldFetch) return;

        download.mutate().then(data => {
            downloadFile(data);
            setShouldFetch(false);
        });
    }, [download, shouldFetch]);

    return (
        <Button
            onClick={() =>
                !isExternalFile
                    ? setShouldFetch(true)
                    : handleExternalFileDownload()
            }
            sx={{ marginBottom: 2, ...buttonSx }}
            variant="link"
            startIcon={<DownloadIcon />}>
            {buttonText}
        </Button>
    );
};

export default DownloadFile;
