import { ReactNode } from "react";
import { CardContent, Paper, Typography } from "@mui/material";
import Accordion, { AccordionProps } from "@/components/Accordion/Accordion";
import BoxContainer from "@/components/BoxContainer";

export interface AccordionSectionProps
    extends Omit<AccordionProps, "contents"> {
    contents: ReactNode[];
}

export default function AccordionSection({
    contents,
    heading,
    ...restProps
}: AccordionSectionProps) {
    return (
        <Accordion
            {...restProps}
            transparent
            elevation={0}
            heading={<Typography variant="h3">{heading}</Typography>}
            contents={
                <BoxContainer
                    sx={{
                        gridTemplateColumns: {
                            mobile: "repeat(1, 1fr)",
                            desktop: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}>
                    {contents.map(content => (
                        <Paper elevation={0}>
                            <CardContent
                                sx={{
                                    gap: 2,
                                    flexDirection: "column",
                                    display: "flex",
                                }}>
                                {content}
                            </CardContent>
                        </Paper>
                    ))}
                </BoxContainer>
            }
        />
    );
}
