import { useEffect, useState } from "react";
import { SxProps } from "@mui/material";
import { FileExport } from "@/interfaces/FileExport";
import Button from "@/components/Button";
import useGet from "@/hooks/useGet";
import { DownloadIcon } from "@/consts/icons";
import { downloadFile } from "@/utils/download";

interface DownloadFileProps {
    apiPath: string;
    buttonText: string;
    buttonSx?: SxProps;
}

const DownloadFile = ({ apiPath, buttonText, buttonSx }: DownloadFileProps) => {
    const [shouldFetch, setShouldFetch] = useState(false);

    const download = useGet<FileExport>(apiPath, {
        shouldFetch,
    });

    useEffect(() => {
        if (!shouldFetch) return;

        download.mutate().then(data => {
            downloadFile(data);
            setShouldFetch(false);
        });
    }, [download, shouldFetch]);

    return (
        <Button
            onClick={() => setShouldFetch(true)}
            sx={{ marginBottom: 2, ...buttonSx }}
            variant="link"
            startIcon={<DownloadIcon />}>
            {buttonText}
        </Button>
    );
};

export default DownloadFile;
