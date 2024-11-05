import BoxContainer from "@/components/BoxContainer";
import Loading from "@/components/Loading";
import metaData, { noFollowRobots } from "@/utils/metadata";

export const metadata = metaData(
    {
        title: "Dataset Create",
        description: "",
    },
    noFollowRobots
);

export default async function CreateDatasetPageLoader() {
    return (
        <BoxContainer sx={{ mt: "14px" }}>
            <Loading />
        </BoxContainer>
    );
}
