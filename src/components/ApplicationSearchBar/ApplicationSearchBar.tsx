import Box from "@/components/Box";

import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { useForm } from "react-hook-form";
import { Application } from "@/interfaces/Application";
import SearchIcon from "@mui/icons-material/Search";

const ApplicationSearchBar = () => {
    const { control } = useForm<Application>();
    return (
        <>
            <Box>
                <TextField
                    placeholder="Search app names or tags"
                    control={control}
                    icon={SearchIcon}
                    label=""
                    name="search-apps"
                    style={{
                        width: "800px",
                        alignItems: "center",
                    }}
                />
            </Box>
            <Box>
                <Button type="submit">Search</Button>
            </Box>
        </>
    );
};

export default ApplicationSearchBar;
