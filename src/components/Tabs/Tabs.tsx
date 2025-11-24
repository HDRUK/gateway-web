"use client";

/** @jsxImportSource @emotion/react */
import {
    ElementType,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    forwardRef,
} from "react";
import MuiTabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import MuiTabPanel from "@mui/lab/TabPanel";
import { Tab as MuiTab, SxProps, Tooltip } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import ConditionalWrapper from "../ConditionalWrapper";
import Link from "../Link";
import { tabsStyle } from "./Tabs.styles";

export interface Tab {
    label: string;
    value: string;
    tooltip?: string;
    content?: ReactNode;
    disabled?: boolean;
}

export enum TabVariant {
    SEARCH = "search",
    STANDARD = "standard",
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

const tooltipWrapper = (title: string) => (children: ReactElement) => {
    return (
        <Tooltip title={title} describeChild>
            {children}
        </Tooltip>
    );
};

const CustomLink = forwardRef<
    HTMLAnchorElement & { param: string; persist: boolean },
    {
        href: string;
        children: ReactNode;
        param: string;
        persist: boolean;
        tooltip?: string;
    }
>(({ href, children, param, persist, tooltip, ...rest }, ref) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const currentQuery = Object.fromEntries(searchParams?.entries() ?? []);
    currentQuery[param] = href;

    if ("page" in currentQuery) {
        currentQuery.page = "1";
    }

    return (
        <ConditionalWrapper
            requiresWrapper={!!tooltip}
            wrapper={tooltipWrapper(tooltip || "")}>
            <Link
                ref={ref}
                passHref
                {...rest}
                scroll={false}
                href={{
                    pathname,
                    query: persist ? currentQuery : { [param]: href },
                }}>
                {children}
            </Link>
        </ConditionalWrapper>
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
                <Paper
                    css={
                        variant === TabVariant.SEARCH && tabsStyle.searchTabList
                    }
                    sx={{
                        padding: 0,
                        background: "none",
                        ...tabBoxSx,
                    }}>
                    <MuiTabList
                        aria-label={ariaLabel ?? "tab navigation"}
                        variant={tabVariant}
                        scrollButtons="auto"
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
                        {tabs.map(({ label, value, tooltip, disabled }) => (
                            <MuiTab<ElementType>
                                id={`tab-${value}`}
                                component={CustomLink}
                                disableRipple
                                color="secondary"
                                key={value}
                                href={value}
                                disabled={disabled}
                                value={value}
                                label={label}
                                css={
                                    variant === TabVariant.SEARCH
                                        ? tabsStyle.search
                                        : tabsStyle.normal
                                }
                                param={paramName}
                                persist={persistParams}
                                tooltip={tooltip}
                                aria-description={tooltip}
                            />
                        ))}
                    </MuiTabList>
                </Paper>

                {introContent}

                {renderTabContent &&
                    tabs.map(({ value, content }) => (
                        <MuiTabPanel
                            aria-labelledby={`tab-${value}`}
                            sx={{ padding: 0 }}
                            key={value}
                            value={value}>
                            {content && content}
                        </MuiTabPanel>
                    ))}
            </MuiTabContext>
        </Box>
    );
};

export default Tabs;
