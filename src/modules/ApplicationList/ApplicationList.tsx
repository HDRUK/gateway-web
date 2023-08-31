import BackButton from "@/components/BackButton";
import ApplicationListItem from "@/components/ApplicationListItem";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import Loading from "@/components/Loading";
import useGet from "@/hooks/useGet";
import { useState, useEffect } from "react";
import ApplicationSearchBar from "@/components/ApplicationSearchBar";
import BoxContainer from "@/components/BoxContainer";
import { Box } from "@mui/material";


const ApplicationList = () => {

    const [filterQuery,setFilterQuery] = useState('');

    const { 
        data: applicationsList = [], 
        isLoading: isApplicationListLoading ,
        mutate: mutate,
    } = useGet<Application[]>(`${apis.applicationsV1Url}?${filterQuery}`);
   

    return (
        <BoxContainer>
            <Box
                sx={{
                    gridColumn: { tablet: "span 2", laptop: "span 1" },
                }}>
                <BackButton label="Back" />
            </Box>
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                }}
            >
                <ApplicationSearchBar setFilterQuery={setFilterQuery} />
            </Box>
            {
                isApplicationListLoading ? <Loading /> :
                applicationsList.map(application => (
                    <ApplicationListItem
                        id={application.id}
                        name={application.name}
                        app_id={application.app_id}
                        description={application.description}
                        created_at={application.created_at}
                        enabled={application.enabled}
                    />
                ))
            }
        </BoxContainer>
    );
};

export default ApplicationList;
