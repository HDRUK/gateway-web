"use client";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { useForm } from "react-hook-form";

import {
    cohortExportDefaultValues,
    cohortExportFormFields,
} from "@/config/forms/cohortAdminExport";

import ModalForm from "@/components/ModalForm";
import { useEffect, useState } from "react";

interface CsvExport {
    content: string;
    type: string;
    filename: string;
}

const CohortTableDownload = () => {
    const [filter, setFilter] = useState<string | null>(null);
    //we dont really want to retrieve the data the first time
    // - shouldFetch: false?
    //when mutate we want to use shouldFetch:true
    const { mutate } = useGet<CsvExport>(
        filter && `${apis.cohortRequestsV1Url}/export?${filter}`
    );

    const { control, watch, reset } = useForm({
        defaultValues: cohortExportDefaultValues,
    });

    useEffect(() => {
        //dont try and retrieve if there is no filter set
        if (!filter) return;

        mutate().then(csvData => {
            if (!csvData) return;
            const { content, type, filename } = csvData;
            const blob = new Blob([content], { type: type });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            link.click();
            link.remove();
        });
    }, [filter]);

    const onSuccess = () => {
        const organisations = watch("organisations");
        const dateRangeFrom = watch("dateRangeFrom").format("YYYY-MM-DD");
        const dateRangeTo = watch("dateRangeTo").format("YYYY-MM-DD");

        const filters = new URLSearchParams();
        filters.append("to", dateRangeTo);
        filters.append("from", dateRangeFrom);

        //note: this might be better to be not so card coded?
        //      use cohortRequestStatusValues ?
        const watchedStatusValues = [
            { key: "APPROVED", value: watch("status_APPROVED") },
            { key: "REJECTED", value: watch("status_REJECTED") },
            { key: "PENDING", value: watch("status_PENDING") },
            { key: "BANNED", value: watch("status_BANNED") },
            { key: "SUSPENDED", value: watch("status_SUSPENDED") },
            { key: "EXPIRED", value: watch("status_EXPIRED") },
        ];

        const request_status = watchedStatusValues
            .filter(w => w.value === true)
            .map(w => w.key)
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
        <>
            <ModalForm
                control={control}
                formFields={cohortExportFormFields}
                onSuccess={onSuccess}
                onCancel={onCancel}
                label={"Download dashboard report"}
                ariaLabel={"download-cohort-table"}
            />
        </>
    );
};

export default CohortTableDownload;
