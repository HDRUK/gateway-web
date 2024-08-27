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

export { downloadFile };
