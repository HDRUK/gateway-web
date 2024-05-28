import BoxContainer from "@/components/BoxContainer";
import Loading from "@/components/Loading";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Dataset Create",
    description: "",
};

export default async function CreateDatasetPageLoader() {
    return (
        <BoxContainer sx={{ mt: "14px" }}>
            <Loading />
        </BoxContainer>
    );
}
