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

export interface Tab {
    label: string;
    value: string;
    content: ReactNode;
}

export enum TabVariant {
    STANDARD = "standard",
    LARGE = "large",
    SLIM = "slim",
    SEARCH = "search",
}

export interface TabProps {
    ariaLabel?: string;
    tabs: Tab[];
    introContent?: ReactNode;
    centered?: boolean;
    tabBoxSx?: SxProps;
    rootBoxSx?: SxProps;
    variant?: TabVariant;
    paramName?: string;
    renderTabContent?: boolean;
    persistParams?: boolean;
    defaultSelectedTab?: string;
    tabVariant?: string;
    handleChange?: (e: SyntheticEvent, value: string) => void;
}

const CustomLink = forwardRef<
    HTMLAnchorElement & { param: string; persist: boolean },
    { href: string; children: ReactNode; param: string; persist: boolean }
>((props, ref) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { persist, ...rest } = props;

    const currentQuery = searchParams?.entries()
        ? Object.fromEntries(searchParams.entries())
        : {};

    currentQuery[props.param] = props.href;

    if ("page" in currentQuery) {
        currentQuery.page = "1";
    }

    return (
        <Link
            ref={ref}
            passHref
            {...rest}
            scroll={false}
            href={{
                pathname,
                query: persist ? currentQuery : { [props.param]: props.href },
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
    defaultSelectedTab,
    tabVariant = "",
    ariaLabel,
    handleChange,
}: TabProps) => {
    const searchParams = useSearchParams();
    const currentTab = searchParams?.get(paramName);
    const selectedTab = currentTab || defaultSelectedTab || tabs[0].value;

    return (
        <Box sx={{ width: "100%", typography: "body1", ...rootBoxSx }}>
            <MuiTabContext value={selectedTab}>
                <Box
                    // css={variant === TabVariant.LARGE && tabsStyle.tabList}
                    sx={{
                        padding: 0,
                        background: "none",
                        sx: {
                            //TODO: only apply when needed
                            display: "flex",
                            justifyContent: "center",
                        },
                        ...tabBoxSx,
                    }}>
                    <MuiTabList
                        aria-label={ariaLabel ?? "tab navigation"}
                        variant={tabVariant}
                        scrollButtons={true}
                        sx={{
                            mb: variant === TabVariant.STANDARD ? 1 : 0,
                            ".MuiTabs-indicator": {
                                display:
                                    variant !== TabVariant.STANDARD
                                        ? "none"
                                        : "block",
                            },
                        }}
                        centered={centered}
                        onChange={handleChange}>
                        {tabs.map(tab => (
                            <MuiTab<ElementType>
                                id={`tab-${tab.value}`}
                                component={CustomLink}
                                disableRipple
                                color="secondary"
                                key={tab.value}
                                href={tab.value}
                                value={tab.value}
                                label={tab.label}
                                css={
                                    variant === TabVariant.SEARCH
                                        ? tabsStyle.search
                                        : tabsStyle.normal
                                }
                                param={paramName}
                                persist={persistParams}
                            />
                        ))}
                    </MuiTabList>
                </Box>
                {introContent}
                {renderTabContent &&
                    tabs.map(tab => (
                        <MuiTabPanel
                            aria-labelledby={`tab-${tab.value}`}
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
