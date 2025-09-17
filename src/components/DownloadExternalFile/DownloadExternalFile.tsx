import Cookies from "js-cookie";
import notificationService from "@/services/notification";
import { sessionCookie } from "@/config/session";
import { downloadExternalFile } from "@/utils/download";
import { logger } from "@/utils/logger";
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
        const session = Cookies.get(sessionCookie)!;
        if (process.env.NEXT_PUBLIC_LOG_LEVEL === "debug") {
            const message = {
                apiPath,
                fileName,
            };
            logger.info(message, session, "DownloadExternalFile");
        }
        if (!fileName) {
            return;
        }

        const response = await fetch(apiPath);

        if (!response.ok) {
            let errorMessage: string;

            try {
                const errorData = await response.json();
                errorMessage = JSON.stringify(errorData, null, 2);
            } catch {
                errorMessage = await response.text();
            }
            logger.error(errorMessage, session, `DownloadExternalFile`);

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
