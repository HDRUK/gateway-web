import Box from "@/components/Box";
import Typography from "@/components/Typography";

export default function DatasetV2Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Box sx={{ bgcolor: "warning.light", textAlign: "center", p: 1 }}>
                <Typography variant="body2">
                    EXPERIMENTAL v2 PREVIEW &mdash; schema-driven rendering of
                    live Gateway data. Not linked from the site.
                </Typography>
            </Box>
            {children}
        </>
    );
}
