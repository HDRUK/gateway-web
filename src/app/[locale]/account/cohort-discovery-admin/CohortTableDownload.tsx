"use client";

import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { useForm } from "react-hook-form";
import { DownloadIcon } from "@/consts/icons";
import { Typography, Box } from "@mui/material";
import {
    cohortExportDefaultValues,
    cohortExportFormFields,
} from "@/config/forms/cohortAdminExport";

import { CohortExportForm } from "@/interfaces/CohortExport";
import ModalForm from "@/components/ModalForm";
import { useEffect, useState } from "react";

interface CsvExport {
    content: string;
    type: string;
    filename: string;
}

const CohortTableDownload = () => {
    const [filter, setFilter] = useState<string | null>(null);

    const { mutate } = useGet<CsvExport>(
        filter && `${apis.cohortRequestsV1Url}/export?${filter}`
    );

    const { control, reset, handleSubmit } = useForm({
        defaultValues: cohortExportDefaultValues,
    });

    useEffect(() => {
        // dont try and retrieve data and download there is no filter set
        if (!filter) return;

        mutate().then(csvData => {
            if (!csvData) return;
            const { content, type, filename } = csvData;
            const blob = new Blob([content], { type });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            link.click();
            link.remove();
        });
    }, [filter, mutate]);

    const handleExport = (formData: CohortExportForm) => {
        const { organisations } = formData;
        const dateRangeFrom = formData.dateRangeFrom.format("YYYY-MM-DD");
        const dateRangeTo = formData.dateRangeTo.format("YYYY-MM-DD");

        const filters = new URLSearchParams();
        filters.append("to", dateRangeTo);
        filters.append("from", dateRangeFrom);

        const watchedStatusValues = formData.status;

        const request_status = Object.entries(watchedStatusValues)
            .filter(([, value]) => value === true)
            .map(([key]) => key)
            .join(",");

        if (request_status) {
            filters.append("request_status", request_status);
        }

        if (organisations.length > 0) {
            filters.append("organisation", organisations.join(","));
        }

        const newFilter = filters.toString();
        setFilter(newFilter);
    };

    const onCancel = () => {
        reset();
    };

    return (
        <ModalForm
            control={control}
            formFields={cohortExportFormFields}
            onSuccess={handleSubmit(handleExport)}
            onCancel={onCancel}
            confirmText="Export xs file"
            cancelText="Cancel"
            title="Export Filters"
            buttonContent={
                <Box
                    sx={{ p: 0 }}
                    display="flex"
                    alignItems="center"
                    aria-label="download-cohort-table">
                    <DownloadIcon color="primary" />
                    <Typography color="primary">
                        Download dashboard report
                    </Typography>
                </Box>
            }
        />
    );
};

export default CohortTableDownload;
