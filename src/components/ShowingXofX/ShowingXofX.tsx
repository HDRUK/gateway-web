import Typography from "@/components/Typography";

interface ShowingXofXProps {
    from?: number;
    to?: number;
    total?: number;
}

const ShowingXofX = ({ from, to, total }: ShowingXofXProps) => {
    return (
        <Typography sx={{ p: 0, mb: 1 }}>
            Showing {from || 0}-{to || 0} of {total || 0}
        </Typography>
    );
};

export default ShowingXofX;
