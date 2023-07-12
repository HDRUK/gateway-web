import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import BackButton from "@/components/BackButton";
import ApplicationListItem from "@/components/ApplicationListItem";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import Loading from "@/components/Loading";
import useGet from "@/hooks/useGet";
import ApplicationSearchBar from "@/components/ApplicationSearchBar";

interface ApplicationListItemProps {
    name: string;
}

const ApplicationList = () => {
    const { data: applicationsList = [], isLoading: isApplicationListLoading } =
        useGet<Application[]>(apis.applicationsV1Url);

    if (isApplicationListLoading) return <Loading />;

    return (
        <>
            <Head title="Health Data Research Innovation Gatewway - My account - Applications" />
            <BoxContainer>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 2", laptop: "span 1" },
                    }}>
                    <BackButton label="Back to app selection" />
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
                        id={application.id}
                        name={application.name}
                        app_id={application.app_id}
                        description={application.description}
                        created_at={application.created_at}
                        tags={application.tags}
                        enabled={application.enabled}
                    />
                ))}
            </BoxContainer>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    req,
    locale,
}) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default ApplicationList;
