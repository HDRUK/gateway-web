import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "@/components/Typography";

const DeleteApplication = () => {
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
                <Button type="submit" variant="outlined" color="secondary">
                    Delete App
                </Button>
            </Box>
        </Box>
    );
};

export default DeleteApplication;
