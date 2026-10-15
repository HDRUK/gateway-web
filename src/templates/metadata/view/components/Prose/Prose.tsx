import Typography from "@/components/Typography";

export interface ProseProps {
    field: string;
    data?: Record<string, unknown>;
}

const Prose = ({ field, data }: ProseProps) => {
    const value = data?.[field];

    if (typeof value !== "string" || !value) return null;

    return (
        <Typography
            variant="body1"
            sx={{ mb: 2, fontSize: 18, lineHeight: 1.55 }}>
            {value}
        </Typography>
    );
};

export default Prose;
