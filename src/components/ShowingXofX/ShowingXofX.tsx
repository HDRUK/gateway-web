import Box from "@/components/Box";

interface ShowingXofXProps {
    from?: number;
    to?: number;
    total?: number;
}

const ShowingXofX = ({ from = 0, to = 0, total = 0 }: ShowingXofXProps) => {
    return (
        <Box sx={{ p: 0, mb: 1 }}>
            Showing {from}-{to} of {total}
        </Box>
    );
};

export default ShowingXofX;
