import { Tab as MuiTab } from "@mui/material";
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
    onChange: (value: string) => void;
    centered?: boolean;
}

const Tabs = ({ tabs, onChange, value, centered }: TabProps) => {
    const handleChange = (e: React.SyntheticEvent, selectedTab: string) => {
        if (typeof onChange === "function") {
            onChange(selectedTab);
        }
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <MuiTabContext value={value}>
                <Box
                    sx={{
                        paddingBottom: 0,
                        boxShadow: "0px 15px 5px -14px rgba(0,0,0,.09)",
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
};

export default Tabs;
