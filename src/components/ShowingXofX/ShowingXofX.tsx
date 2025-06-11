import Typography from "@/components/Typography";

interface ShowingXofXProps {
    from?: number;
    to?: number;
    total?: number;
    hideTotal?: boolean;
}

const ShowingXofX = ({ from, to, total, hideTotal }: ShowingXofXProps) => {
    return (
        <Typography sx={{ p: 0, mb: 1 }}>
            Showing {from || 0}-{to || 0}
            {!hideTotal && <> of {total || 0} results</>}.
        </Typography>
    );
};

export default ShowingXofX;
