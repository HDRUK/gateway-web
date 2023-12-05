import Box from "@/components/Box";

interface ShowingXofXProps {
    from?: number;
    to?: number;
    total?: number;
}

const ShowingXofX = ({ from, to, total }: ShowingXofXProps) => {
    return (
        <Box sx={{ p: 0, mb: 1 }}>
            Showing {from || 0}-{to || 0} of {total || 0}
        </Box>
    );
};

export default ShowingXofX;
