import ApplicationListItem from "@/modules/ApplicationListItem";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { useState } from "react";
import { useRouter } from "next/router";
import BoxContainer from "@/components/BoxContainer";
import { Box, Typography } from "@mui/material";
import ApplicationSearchBar from "@/modules/ApplicationSearchBar";

const ApplicationList = () => {
    const [filterQuery, setFilterQuery] = useState("");

    const router = useRouter();
    const { teamId } = router.query;

    const { data: applicationsList } = useGet<Application[]>(
        filterQuery
            ? `${apis.applicationsV1Url}?team_id=${teamId}&${filterQuery}`
            : null,
        {
            keepPreviousData: true,
        }
    );

    return (
        <BoxContainer>
            <ApplicationSearchBar setFilterQuery={setFilterQuery} />

            <Box display="flex" justifyContent="flex-end">
                <Typography>
                    Number of Apps: <strong>{applicationsList?.length}</strong>
                </Typography>
            </Box>
            {applicationsList?.map(application => (
                <ApplicationListItem
                    key={application.id}
                    application={application}
                />
            ))}
        </BoxContainer>
    );
};

export default ApplicationList;
