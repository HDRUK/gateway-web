import { Tab as MuiTab, SxProps } from "@mui/material";
import { ElementType, ReactNode, forwardRef } from "react";

import MuiTabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import MuiTabPanel from "@mui/lab/TabPanel";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
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
    const router = useRouter();

    return (
        <Link
            ref={ref}
            passHref
            {...props}
            href={{
                pathname: router.pathname,
                query: { ...router.query, tab: props.href },
            }}>
            {props.children}
        </Link>
    );
});

const Tabs = ({
    tabs,
    centered,
    introContent,
    tabBoxSx,
    rootBoxSx,
}: TabProps) => {
    const searchParams = useSearchParams();
    const selectedTab = searchParams.get("tab") || tabs[0].value;

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

Tabs.defaultProps = {
    centered: false,
    introContent: "",
    tabBoxSx: {},
    rootBoxSx: {},
};

export default Tabs;
