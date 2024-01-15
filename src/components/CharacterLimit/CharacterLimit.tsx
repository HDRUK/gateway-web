import { useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { colors } from "@/config/theme";

interface CharacterLimitProps {
    limit: number;
    count: number;
}

const CharacterLimit = ({ limit, count }: CharacterLimitProps) => {
    const countValue = useMemo(() => limit - count, [limit, count]);

    return (
        <Box
            sx={{
                padding: 0,
                display: "flex",
                justifyContent: "space-between",
            }}>
            <Typography color={colors.grey500} fontSize={13}>
                {limit} character limit
            </Typography>
            <Typography color={colors.grey500} fontSize={13}>
                ({countValue}/{limit})
            </Typography>
        </Box>
    );
};

export default CharacterLimit;
