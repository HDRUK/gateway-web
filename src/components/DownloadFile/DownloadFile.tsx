import { useState } from "react";
import { SxProps } from "@mui/material";
import { ButtonProps } from "@/components/Button/Button";
import { FileExport } from "@/interfaces/FileExport";
import useGet from "@/hooks/useGet";
import { downloadFile } from "@/utils/download";
import DownloadButton from "../DownloadButton";

export interface DownloadFileProps {
    apiPath: string;
    buttonText: string;
    buttonSx?: SxProps;
    variant?: ButtonProps["variant"];
}

const DownloadFile = ({
    apiPath,
    buttonText,
    buttonSx,
    variant,
}: DownloadFileProps) => {
    const [triggerFetch, setTriggerFetch] = useState(false);
    const download = useGet<FileExport>(apiPath, {
        shouldFetch: triggerFetch,
    });
    const handleDownload = async () => {
        setTriggerFetch(true);
    };

    if (triggerFetch && download.data) {
        downloadFile(download.data);
        setTriggerFetch(false);
    }
    return (
        <DownloadButton onClick={handleDownload} sx={buttonSx} variant={variant}>
            {buttonText}
        </DownloadButton>
    );
};

export default DownloadFile;
