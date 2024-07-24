import { CardContent, Paper, PaperProps } from "@mui/material";

export type AccordionCardProps = PaperProps;

export default function AccordionCard({
    children,
    ...restProps
}: AccordionCardProps) {
    return (
        <Paper elevation={0} {...restProps}>
            <CardContent
                sx={{
                    gap: 2,
                    flexDirection: "column",
                    display: "flex",
                }}>
                {children}
            </CardContent>
        </Paper>
    );
}
