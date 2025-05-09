import { useState } from "react";
import { SxProps } from "@mui/material";
import { FileExport } from "@/interfaces/FileExport";
import useGet from "@/hooks/useGet";
import { downloadFile } from "@/utils/download";
import DownloadButton from "../DownloadButton";

export interface DownloadFileProps {
    apiPath: string;
    buttonText: string;
    buttonSx?: SxProps;
}

const DownloadFile = ({ apiPath, buttonText, buttonSx }: DownloadFileProps) => {
    const [isFetched, setIsFetched] = useState(false);
    const download = useGet<FileExport>(apiPath, {
        shouldFetch: !isFetched,
    });

    const handleDownload = () => {
        download.mutate().then(data => {
            downloadFile(data);
            setIsFetched(true);
        });
    };

    return (
        <DownloadButton onClick={handleDownload} sx={buttonSx}>
            {buttonText}
        </DownloadButton>
    );
};

export default DownloadFile;
