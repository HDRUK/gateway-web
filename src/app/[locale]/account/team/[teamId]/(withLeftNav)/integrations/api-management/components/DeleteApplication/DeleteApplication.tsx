import { useParams, useRouter } from "next/navigation";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";

const DeleteApplication = ({ applicationId }: { applicationId: number }) => {
    const { push } = useRouter();
    const params = useParams<{ teamId: string }>();

    const deleteApplicationApi = useDelete(apis.applicationsV1Url);
    const deleteApplication = async () => {
        await deleteApplicationApi(applicationId).then(
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.LIST}`
            )
        );
    };

    return (
        <Box sx={{ padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flex: 1, p: 0 }}>
                <Typography variant="h3">Delete this app</Typography>
                <Typography>
                    Permanently delete this app from your management page. This
                    act is irreversible.
                </Typography>
            </Box>
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    justifyContent: "end",
                }}>
                <Button
                    onClick={deleteApplication}
                    variant="outlined"
                    color="secondary">
                    Delete App
                </Button>
            </Box>
        </Box>
    );
};

export default DeleteApplication;
