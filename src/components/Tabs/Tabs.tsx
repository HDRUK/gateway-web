import { Tab as MuiTab, SxProps } from "@mui/material";
import { ReactNode } from "react";

import MuiTabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import MuiTabPanel from "@mui/lab/TabPanel";
import Box from "../Box";

interface Tab {
    label: string;
    value: string;
    content: ReactNode;
}

export interface TabProps {
    tabs: Tab[];
    value: string;
    introContent?: ReactNode;
    onChange: (value: string) => void;
    centered?: boolean;
    tabBoxSx?: SxProps;
    rootBoxSx?: SxProps;
}

const Tabs = ({
    tabs,
    onChange,
    value,
    centered,
    introContent,
    tabBoxSx,
    rootBoxSx,
}: TabProps) => {
    const handleChange = (e: React.SyntheticEvent, selectedTab: string) => {
        if (typeof onChange === "function") {
            onChange(selectedTab);
        }
    };

    return (
        <Box sx={{ width: "100%", typography: "body1", ...rootBoxSx }}>
            <MuiTabContext value={value}>
                <Box
                    sx={{
                        paddingBottom: 0,
                        boxShadow: "0px 15px 5px -14px rgba(0,0,0,.09)",
                        ...tabBoxSx,
                    }}>
                    <MuiTabList centered={centered} onChange={handleChange}>
                        {tabs.map(tab => (
                            <MuiTab
                                disableRipple
                                color="secondary"
                                key={tab.value}
                                value={tab.value}
                                label={tab.label}
                            />
                        ))}
                    </MuiTabList>
                </Box>
                {introContent}
                {tabs.map(tab => (
                    <MuiTabPanel key={tab.value} value={tab.value}>
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
