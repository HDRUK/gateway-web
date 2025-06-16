import Cookies from "js-cookie";
import notificationService from "@/services/notification";
import { sessionCookie, sessionHeader, sessionPrefix } from "@/config/session";
import { downloadExternalFile } from "@/utils/download";
import DownloadButton from "../DownloadButton";
import { DownloadFileProps } from "../DownloadFile";

interface DownloadExternalFileProps extends DownloadFileProps {
    fileName?: string;
}

const DownloadExternalFile = ({
    apiPath,
    buttonText,
    fileName,
    buttonSx,
}: DownloadExternalFileProps) => {
    const handleDownload = async () => {
        if (!fileName) {
            return;
        }
        const session = Cookies.get(sessionCookie);
        const response = await fetch(apiPath, {
            headers: { [sessionHeader]: sessionPrefix + session },
        });

        if (!response.ok) {
            notificationService.apiError("Failed to download file");
            return;
        }

        downloadExternalFile(response, fileName);
    };

    return (
        <DownloadButton onClick={handleDownload} sx={{ mb: 0, ...buttonSx }}>
            {buttonText}
        </DownloadButton>
    );
};

export default DownloadExternalFile;
