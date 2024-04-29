"use client";

/** @jsxImportSource @emotion/react */
import { ElementType, ReactNode, SyntheticEvent, forwardRef } from "react";
import MuiTabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import MuiTabPanel from "@mui/lab/TabPanel";
import { Tab as MuiTab, SxProps } from "@mui/material";
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
    persistParams?: boolean;
    handleChange?: (e: SyntheticEvent, value: string) => void;
}

const CustomLink = forwardRef<
    HTMLAnchorElement & { param: string; persist: boolean },
    { href: string; children: ReactNode; param: string; persist: boolean }
>((props, ref) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { persist, ...rest } = props;
    return (
        <Link
            ref={ref}
            passHref
            {...rest}
            href={{
                pathname,
                query:
                    searchParams?.entries() && persist
                        ? {
                              ...Object.fromEntries(searchParams?.entries()),
                              [props.param]: props.href,
                          }
                        : {
                              [props.param]: props.href,
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
    persistParams = true,
    handleChange,
}: TabProps) => {
    const searchParams = useSearchParams();
    const currentTab = searchParams?.get(paramName);

    const selectedTab = currentTab || tabs[0].value;

    return (
        <Box sx={{ width: "100%", typography: "body1", ...rootBoxSx }}>
            <MuiTabContext value={selectedTab}>
                <Paper
                    css={variant === TabVariant.LARGE && tabsStyle.tabList}
                    sx={{
                        paddingBottom: 0,
                        ...tabBoxSx,
                        background: "none",
                    }}>
                    <MuiTabList
                        sx={{ mb: variant === TabVariant.STANDARD ? 1 : 0 }}
                        centered={centered}
                        onChange={handleChange}>
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
                                param={paramName}
                                persist={persistParams}
                                wrapped={false}
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
