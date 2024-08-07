import { useEffect, useState } from "react";
import { FileExport } from "@/interfaces/FileExport";
import Button from "@/components/Button";
import useGet from "@/hooks/useGet";
import { DownloadIcon } from "@/consts/icons";
import { downloadFile } from "@/utils/download";

interface DownloadFileProps {
    apiPath: string;
    buttonText: string;
}

const DownloadFile = ({ apiPath, buttonText }: DownloadFileProps) => {
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
            sx={{ marginBottom: 2 }}
            variant="link"
            startIcon={<DownloadIcon />}>
            {buttonText}
        </Button>
    );
};

export default DownloadFile;
