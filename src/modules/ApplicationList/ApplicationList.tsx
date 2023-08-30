import BackButton from "@/components/BackButton";
import ApplicationListItem from "@/components/ApplicationListItem";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import Loading from "@/components/Loading";
import useGet from "@/hooks/useGet";
import ApplicationSearchBar from "@/components/ApplicationSearchBar";
import BoxContainer from "@/components/BoxContainer";
import { Box } from "@mui/material";

const ApplicationList = () => {
    const { data: applicationsList = [], isLoading: isApplicationListLoading } =
        useGet<Application[]>(apis.applicationsV1Url);

    if (isApplicationListLoading) return <Loading />;

    return (
        <BoxContainer>
            <Box
                sx={{
                    gridColumn: { tablet: "span 2", laptop: "span 1" },
                }}>
                <BackButton label="Back to integrations" />
            </Box>
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                }}>
                <ApplicationSearchBar />
            </Box>
            {applicationsList.map(application => (
                <ApplicationListItem
                    key={application.id}
                    application={application}
                />
            ))}
        </BoxContainer>
    );
};

export default ApplicationList;
