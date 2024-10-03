import { Box, BoxProps, List, ListItem, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { DataProvider } from "@/interfaces/DataProvider";
import Link from "@/components/Link";

interface TrailingContentProps extends BoxProps {
    data: Pick<DataProvider, "service" | "url">;
}

const TrailingContent = ({ data, ...restProps }: TrailingContentProps) => {
    console.log("DATA", data);
    return (
        <Box
            component={Typography}
            variant="caption"
            {...restProps}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ...restProps.sx,
            }}>
            {data.url && (
                <Link href={data.url} variant="caption">
                    {data.url}
                </Link>
            )}
            {data.service?.length && (
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    Useful links:
                    <List
                        sx={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 0.5,
                            "> li::after": {
                                content: '","',
                            },
                            "> li:last-child::after": {
                                content: '""',
                            },
                        }}>
                        {data.service?.map(href => {
                            return (
                                <ListItem sx={{ p: 0 }}>
                                    <Link
                                        href={href}
                                        key={href}
                                        underline="none"
                                        variant="caption">
                                        {href}
                                    </Link>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default TrailingContent;
