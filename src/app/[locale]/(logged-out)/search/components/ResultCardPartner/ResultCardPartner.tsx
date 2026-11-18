"use client";

import { tokens } from "@hdruk/ui/theme";
import {
    Box,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { SearchResultPartner } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Typography from "@/components/Typography";

interface ResultCardPartnerProps {
    result: SearchResultPartner;
}

const ResultCardPartner = ({ result }: ResultCardPartnerProps) => {
    const theme = useTheme();
    const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

    const { hit, portal } = result;

    return (
        <ListItem
            sx={{ p: 0, borderBottom: `1px solid ${tokens.status.grey}` }}
            alignItems="flex-start">
            <ListItemText
                sx={{
                    display: "flex",
                    gap: 1,
                    flexDirection: "column",
                    m: 0,
                    padding: 2,
                    paddingBottom: 1,
                }}
                disableTypography
                primary={
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isMobileOrTablet ? "column" : "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 2,
                        }}>
                        <Box sx={{ flex: 1 }}>
                            <h3 style={{ margin: 0, marginBottom: 4 }}>
                                <Link
                                    href={hit.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    fontSize={16}
                                    fontWeight={600}>
                                    <EllipsisLineLimit
                                        text={hit.title}
                                        showToolTip
                                        maxLine={isMobileOrTablet ? 2 : 1}
                                    />
                                </Link>
                            </h3>
                            {hit.organisation && (
                                <Typography
                                    sx={{
                                        color: tokens.brand.secondary,
                                        mb: 2,
                                    }}>
                                    {hit.organisation}
                                </Typography>
                            )}
                            <Typography
                                component="div"
                                sx={{
                                    color: tokens.text.secondaryBlack,
                                    mt: 0.5,
                                }}>
                                <EllipsisLineLimit
                                    text={hit.description}
                                    maxLine={3}
                                />
                            </Typography>
                        </Box>
                        <Box
                            component="img"
                            src={portal.logo}
                            alt={portal.name}
                            sx={{
                                height: 40,
                                objectFit: "contain",
                                flexShrink: 0,
                                mt: 0.5,
                            }}
                        />
                    </Box>
                }
                secondary={null}
            />
        </ListItem>
    );
};

export default ResultCardPartner;
