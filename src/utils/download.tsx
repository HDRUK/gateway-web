import { CsvExport } from "@/interfaces/CsvExport";

const downloadCSV = (csvData: CsvExport | undefined) => {
    if (!csvData) return;
    const { content, type, filename } = csvData;
    const blob = new Blob([content], { type });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    link.click();
    link.remove();
};

export { downloadCSV };
