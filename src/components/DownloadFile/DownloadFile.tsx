import { ReactNode, useEffect, useState } from "react";
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
    startIcon?: ReactNode;
}

const DownloadFile = ({
    apiPath,
    buttonText,
    isExternalFile,
    externalFileName,
    buttonSx,
    startIcon = <DownloadIcon />,
}: DownloadFileProps) => {
    const [shouldFetch, setShouldFetch] = useState(false);
    console.log('useGet', shouldFetch);
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
        console.log('useEffect 1', download, shouldFetch);
        if (!shouldFetch) return;
        console.log('useEffect 2', download, shouldFetch);

        download.mutate().then(data => {
            console.log('data', data);
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
            startIcon={startIcon}>
            {buttonText}
        </Button>
    );
};

export default DownloadFile;
