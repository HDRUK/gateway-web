import { Checkbox, ListItemText, MenuItem, Typography } from "@mui/material";
import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from "@/consts/roles";

const SelectRoles = () => {
    const roleOptions = [
        {
            name: "Team Admin",
            role: ROLE_CUSTODIAN_TEAM_ADMIN,
            description:
                "Can add or remove team members, and edit their roles.",
        },
        {
            name: "Team Developer",
            role: ROLE_CUSTODIAN_DEVELOPER,
            description: "Can develop, sample copy to be updated.",
        },
        {
            name: "Metadata Manager",
            role: ROLE_CUSTODIAN_METADATA_MANAGER,
            description:
                "Can create and edit dataset metadata, and edit team roles related to dataset metadata.",
        },
        {
            name: "Metadata Editor",
            role: ROLE_CUSTODIAN_METADATA_EDITOR,
            description: "Can create and edit dataset metadata.",
        },
        {
            name: "Data Access Request Manager",
            role: ROLE_CUSTODIAN_DAR_MANAGER,
            description:
                "Can review data access request applications, assign workflows to other team members, and edit team roles related to data access requests.",
        },
        {
            name: "Data Access Request Reviewer",
            role: ROLE_CUSTODIAN_DAR_REVIEWER,
            description:
                "Can review sections of data access request applications that have been assigned to them through workflows.",
        },
    ];
    const RoleSelect = () => {
        return roleOptions.map(role => (
            <MenuItem
                sx={{ paddingLeft: "6px" }}
                key={role.name}
                value={role.name}>
                <Checkbox
                    size="small"
                    checked={selectedRoles.indexOf(role.name) > -1}
                />
                <ListItemText
                    sx={{
                        textWrap: "wrap",
                    }}
                    primary={
                        <Typography
                            sx={{
                                fontWeight: 700,
                            }}>
                            {role.name}
                        </Typography>
                    }
                    secondary={
                        <Typography
                            sx={{
                                fontSize: "11px",
                            }}>
                            {role.description}
                        </Typography>
                    }
                />
            </MenuItem>
        ));
    };
    return <div />;
};

export default SelectRoles;
