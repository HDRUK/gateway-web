"use client";

/** @jsxImportSource @emotion/react */
import { ElementType, ReactNode, forwardRef } from "react";
import MuiTabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import MuiTabPanel from "@mui/lab/TabPanel";
import { Tab as MuiTab, SxProps, TabsProps } from "@mui/material";
import { IconButton, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import { tabsStyle } from "./Tabs.styles";

interface Tab {
    label: string;
    value: string;
    content: ReactNode;
}

export enum TabVariant {
    STANDARD = "standard",
    LARGE = "large",
}

export interface TabProps {
    tabs: Tab[];
    introContent?: ReactNode;
    centered?: boolean;
    tabBoxSx?: SxProps;
    rootBoxSx?: SxProps;
    variant?: TabVariant;
    paramName?: string;
    renderTabContent?: boolean;
}

const CustomLink = forwardRef<
    HTMLAnchorElement & { paramName: string },
    { href: string; children: ReactNode; paramName: string }
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
                query: searchParams?.entries() && {
                    ...Object.fromEntries(searchParams?.entries()),
                    [props.paramName]: props.href,
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
    variant = TabVariant.STANDARD,
    paramName = "tab",
    renderTabContent = true,
}: TabProps) => {
    const searchParams = useSearchParams();
    const currentTab = searchParams?.get("tab");
    const theme = useTheme();

    const selectedTab = currentTab || tabs[0].value;

    return (
        <Box sx={{ width: "100%", typography: "body1", ...rootBoxSx }}>
            <MuiTabContext value={selectedTab}>
                <Paper
                    css={variant === TabVariant.LARGE && tabsStyle.tabList}
                    sx={{
                        paddingBottom: 0,
                        ...tabBoxSx,
                    }}>
                    <MuiTabList
                        sx={{ mb: variant === TabVariant.STANDARD ? 1 : 0 }}
                        centered={centered}>
                        {tabs.map(tab => (
                            <MuiTab<ElementType>
                                component={CustomLink}
                                disableRipple
                                color="secondary"
                                key={tab.value}
                                href={tab.value}
                                value={tab.value}
                                label={tab.label}
                                css={
                                    variant === TabVariant.LARGE &&
                                    tabsStyle.tab
                                }
                                paramName={paramName}
                            />
                        ))}
                    </MuiTabList>
                </Paper>
                {introContent}
                {renderTabContent &&
                    tabs.map(tab => (
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
