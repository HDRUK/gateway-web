import { ReactNode } from "react";
import { colors } from "@/config/theme";
import Box from "../Box";
import Typography from "../Typography";

interface KeyValueListProps {
    rows: { key: string; value: ReactNode; color?: string }[];
}

const KeyValueList = ({ rows }: KeyValueListProps) => {
    return (
        <Box sx={{ p: 0 }}>
            {rows.map(row => (
                <Box
                    key={row.key}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            lg: "130px 1fr",
                            md: "130px 1fr",
                            sm: "100px 1fr",
                            xs: "130px 1fr",
                        },
                        p: 0,
                    }}>
                    <Typography
                        sx={{
                            color: row.color || colors.grey500,
                            fontSize: 13,
                        }}>
                        {row.key}:
                    </Typography>
                    <Typography
                        component="div"
                        sx={{ fontSize: 13, color: row.color }}>
                        {row.value}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default KeyValueList;
