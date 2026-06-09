"use client";

import {
    Box,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { SearchResultARDC } from "@/interfaces/Search";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";

const ARDC_BASE_URL = "https://researchdata.edu.au";

interface ResultCardARDCProps {
    result: SearchResultARDC;
    providerLogo?: string;
}

const ResultCardARDC = ({ result, providerLogo }: ResultCardARDCProps) => {
    const theme = useTheme();
    const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("laptop"));

    const title = result.display_title || result.title || "";
    const organisation = result.group;
    const description = result.list_description || result.description || "";
    const href = result.slug
        ? `${ARDC_BASE_URL}/${result.slug}`
        : ARDC_BASE_URL;

    return (
        <ListItem
            sx={{ p: 0, borderBottom: `1px solid ${colors.grey300}` }}
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
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    fontSize={16}
                                    fontWeight={600}>
                                    <EllipsisLineLimit
                                        text={title}
                                        showToolTip
                                        maxLine={isMobileOrTablet ? 2 : 1}
                                    />
                                </Link>
                            </h3>
                            {organisation && (
                                <Typography
                                    sx={{
                                        color: colors.green700,
                                        mb: 2,
                                    }}>
                                    {organisation}
                                </Typography>
                            )}
                            <Typography
                                sx={{
                                    color: colors.grey800,
                                    mt: 0.5,
                                }}>
                                <EllipsisLineLimit
                                    text={description}
                                    maxLine={3}
                                />
                            </Typography>
                        </Box>
                        {providerLogo && (
                            <Box
                                component="img"
                                src={providerLogo}
                                alt="ARDC"
                                sx={{
                                    height: 40,
                                    objectFit: "contain",
                                    flexShrink: 0,
                                    mt: 0.5,
                                }}
                            />
                        )}
                    </Box>
                }
                secondary={null}
            />
        </ListItem>
    );
};

export default ResultCardARDC;
