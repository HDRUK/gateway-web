import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import Box from "../Box";

interface CharacterLimitProps {
    limit: number;
    count: number;
}

const CharacterLimit = ({ limit, count }: CharacterLimitProps) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                padding: 0,
                display: "flex",
                justifyContent: "space-between",
            }}>
            <Typography color={theme.palette.colors.grey500} fontSize={13}>
                {limit} character limit
            </Typography>
            <Typography color={theme.palette.colors.grey500} fontSize={13}>
                {limit - count} / {limit}
            </Typography>
        </Box>
    );
};

export default CharacterLimit;
