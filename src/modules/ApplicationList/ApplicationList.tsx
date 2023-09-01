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
                    p: 0,
                    display: "flex",
                }}
            >
                <ApplicationSearchBar setFilterQuery={setFilterQuery} />
            </Box>
            {
                isApplicationListLoading ? <Loading /> :
                <>
                <Box display="flex" justifyContent="flex-end">
                    <p> Number of Apps: <b>  {applicationsList.length} </b> </p>
                </Box>
                {applicationsList.map(application => (
                    <ApplicationListItem
                        key={application.id}
                        application={application}
                    />
                ))}
                </>
            }
                        
        </BoxContainer>
    );
};

export default ApplicationList;
