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

import { CohortExportForm, CsvExport } from "@/interfaces/CohortExport";
import { User } from "@/interfaces/User";
import ModalForm from "@/components/ModalForm";
import { useEffect, useState, useMemo } from "react";
import { downloadCSV } from "@/utils/download";

const CohortTableDownload = () => {
    const [filter, setFilter] = useState<string | null>(null);

    const { mutate } = useGet<CsvExport>(
        filter && `${apis.cohortRequestsV1Url}/export?${filter}`
    );

    const { control, reset, handleSubmit } = useForm({
        defaultValues: cohortExportDefaultValues,
    });

    //----------------
    // note: calum 13/12/23
    //   - this wont work when the uses is non-super admin...
    //   - we need something to retreive all users so we can get all organisations
    //   - this needs to be fixed in the backend
    //   - we need a route that will return all unique organisation names
    const { data: allUsers } = useGet<User[]>(apis.usersV1Url);

    useEffect(() => {
        // dont try and retrieve data and download there is no filter set
        if (!filter) return;

        mutate().then(data => downloadCSV(data));
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

    const uniqueOrganisations = Array.from(
        new Set(allUsers?.map(u => u.organisation))
    );

    const hydratedFormFields = useMemo(() => {
        return cohortExportFormFields.map(field => {
            /* populate 'organisations' with unique organisations */
            if (field.name === "organisations") {
                return {
                    ...field,
                    options: uniqueOrganisations.map(org => ({
                        value: org,
                        label: org,
                    })),
                };
            }
            return field;
        });
    }, [cohortExportFormFields, uniqueOrganisations]);

    return (
        <ModalForm
            control={control}
            formFields={hydratedFormFields}
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
