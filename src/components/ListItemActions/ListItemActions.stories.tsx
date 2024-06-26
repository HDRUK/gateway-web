import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
} from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { EditIcon } from "@/consts/icons";
import ListItemActions from "./ListItemActions";

const meta: Meta<typeof ListItemActions> = {
    component: ListItemActions,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ListItemActions>;

const Wrapper = () => {
    return (
        <List>
            <Paper>
                <ListItem
                    secondaryAction={
                        <ListItemActions sx={{ minHeight: "128px" }}>
                            <EditIcon />
                        </ListItemActions>
                    }
                    sx={{
                        minHeight: "160px",
                    }}>
                    <ListItemButton component="a">
                        <ListItemText
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                            primary="Content here"
                            primaryTypographyProps={{
                                fontWeight: 600,
                                fontSize: 16,
                                mb: 4,
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </Paper>
        </List>
    );
};

export const Default: Story = {
    render: () => <Wrapper />,
};
