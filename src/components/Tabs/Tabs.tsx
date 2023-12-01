"use client";

import { Tab as MuiTab, SxProps } from "@mui/material";
import { ElementType, ReactNode, forwardRef } from "react";

import MuiTabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import MuiTabPanel from "@mui/lab/TabPanel";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Tab {
    label: string;
    value: string;
    content: ReactNode;
}

export interface TabProps {
    tabs: Tab[];
    introContent?: ReactNode;
    centered?: boolean;
    tabBoxSx?: SxProps;
    rootBoxSx?: SxProps;
}

const CustomLink = forwardRef<
    HTMLAnchorElement,
    { href: string; children: ReactNode }
>((props, ref) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    return (
        <Link
            ref={ref}
            passHref
            {...props}
            href={{
                pathname,
                query: {
                    ...Object.fromEntries(searchParams.entries()),
                    tab: props.href,
                },
            }}>
            {props.children}
        </Link>
    );
});

const Tabs = ({
    tabs,
    centered = false,
    introContent,
    tabBoxSx,
    rootBoxSx,
}: TabProps) => {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab");

    const selectedTab = currentTab || tabs[0].value;

    return (
        <Box sx={{ width: "100%", typography: "body1", ...rootBoxSx }}>
            <MuiTabContext value={selectedTab}>
                <Paper
                    sx={{
                        paddingBottom: 0,
                        ...tabBoxSx,
                    }}>
                    <MuiTabList sx={{ mb: 1 }} centered={centered}>
                        {tabs.map(tab => (
                            <MuiTab<ElementType>
                                component={CustomLink}
                                disableRipple
                                color="secondary"
                                key={tab.value}
                                href={tab.value}
                                value={tab.value}
                                label={tab.label}
                            />
                        ))}
                    </MuiTabList>
                </Paper>
                {introContent}
                {tabs.map(tab => (
                    <MuiTabPanel
                        sx={{ padding: 0 }}
                        key={tab.value}
                        value={tab.value}>
                        {tab.content}
                    </MuiTabPanel>
                ))}
            </MuiTabContext>
        </Box>
    );
};

export default Tabs;
