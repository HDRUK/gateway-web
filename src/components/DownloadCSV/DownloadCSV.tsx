import { DownloadIcon } from "@/consts/icons";
import Button from "@/components/Button";
import { downloadCSV } from "@/utils/download";
import useGet from "@/hooks/useGet";
import { useEffect, useState } from "react";
import { CsvExport } from "@/interfaces/CsvExport";

interface DownloadCSVProps {
    apiPath: string;
    buttonText: string;
}

const DownloadCSV = ({ apiPath, buttonText }: DownloadCSVProps) => {
    const [shouldFetch, setShouldFetch] = useState(false);

    const download = useGet<CsvExport>(apiPath, {
        shouldFetch,
    });

    useEffect(() => {
        if (!shouldFetch) return;

        download.mutate().then(data => {
            downloadCSV(data);
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

export default DownloadCSV;
