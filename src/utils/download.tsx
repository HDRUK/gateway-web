import { FileExport } from "@/interfaces/FileExport";

const downloadFile = (fileData: FileExport | undefined) => {
    if (!fileData) return;
    const { content, type, filename } = fileData;
    const blob = new Blob([content], { type });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    link.click();
    link.remove();
};

const downloadExternalFile = async (
    fileData: Response | undefined,
    fileName: string
) => {
    if (!fileData) return;
    const blob = await fileData.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    link.remove();
};

export { downloadFile, downloadExternalFile };
