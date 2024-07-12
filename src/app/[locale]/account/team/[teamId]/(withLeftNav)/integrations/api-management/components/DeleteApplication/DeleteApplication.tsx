import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Application, ApplicationForm } from "@/interfaces/Application";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Typography from "@/components/Typography";
import useDelete from "@/hooks/useDelete";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";

const DeleteApplication = ({ application }: { application: Application }) => {
    const { push } = useRouter();
    const params = useParams<{ teamId: string }>();

    const deleteApplicationApi = useDelete(apis.applicationsV1Url);
    const submitForm = async () => {
        await deleteApplicationApi(application.id);
        /* setTimout required to prevent useUnsavedChanges hook firing before formState updates */
        setTimeout(() => {
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.LIST}`
            );
        });
    };

    const { handleSubmit } = useForm<ApplicationForm>();

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
                <Form onSubmit={handleSubmit(submitForm)}>
                    <Button type="submit" variant="outlined" color="secondary">
                        Delete App
                    </Button>
                </Form>
            </Box>
        </Box>
    );
};

export default DeleteApplication;
