import {
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import type { MDXComponents } from "mdx/types";
import Box from "@/components/Box";
import Link from "@/components/Link";
import Typography from "@/components/Typography";

const components: MDXComponents = {
    h1: ({ children }) => (
        <Typography variant="articleLead" component="h1">
            {children}
        </Typography>
    ),
    h2: ({ children }) => (
        <Typography variant="articleLead" component="h2">
            {children}
        </Typography>
    ),
    h3: ({ children }) => (
        <Typography variant="h3" component="h3">
            {children}
        </Typography>
    ),
    h4: ({ children }) => (
        <Typography variant="h4" component="h4">
            {children}
        </Typography>
    ),
    p: ({ children }) => (
        <Typography variant="body1" component="p">
            {children}
        </Typography>
    ),
    a: ({ href, children }) => <Link href={href ?? ""}>{children}</Link>,
    hr: () => <Divider sx={{ my: 2 }} />,
    strong: ({ children }) => (
        <Box component="strong" sx={{ p: 0, fontWeight: 600 }}>
            {children}
        </Box>
    ),
    ul: ({ children }) => (
        <Box
            component="ul"
            sx={{ p: 0, pl: 2.5, my: 1, listStyleType: "disc" }}>
            {children}
        </Box>
    ),
    ol: ({ children }) => (
        <Box component="ol" sx={{ p: 0, pl: 2.5, my: 1 }}>
            {children}
        </Box>
    ),
    li: ({ children }) => (
        <Box component="li" sx={{ p: 0, display: "list-item", my: 0.5 }}>
            {children}
        </Box>
    ),
    code: ({ children }) => (
        <Box
            component="code"
            sx={{
                p: 0.25,
                px: 0.5,
                fontFamily: "monospace",
                fontSize: "0.875em",
                bgcolor: "greyCustom.light",
                borderRadius: 0.5,
            }}>
            {children}
        </Box>
    ),
    table: ({ children }) => <Table size="small">{children}</Table>,
    thead: ({ children }) => <TableHead>{children}</TableHead>,
    tbody: ({ children }) => <TableBody>{children}</TableBody>,
    tr: ({ children }) => <TableRow>{children}</TableRow>,
    th: ({ children }) => <TableCell component="th">{children}</TableCell>,
    td: ({ children }) => <TableCell>{children}</TableCell>,
};

export function useMDXComponents(): MDXComponents {
    return components;
}
