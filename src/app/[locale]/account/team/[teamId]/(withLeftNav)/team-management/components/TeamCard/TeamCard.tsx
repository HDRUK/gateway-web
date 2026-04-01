"use client";

import { Grid, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import PermissionDescriptions from "@/modules/PermissionDescriptions";
import { ROLE_SECTIONS } from "@/config/tables/teamMemberManagement";
import PermissionCheckboxes from "../PermissionCheckboxes";
import TableActionCell from "../TableActionCell";

interface Action {
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    };
    checkConditions: (rowUser: User) => {};
    onClick: (rowUser: User) => void;
}

interface TeamCardProps {
    users: User[];
    translations: {
        [key: string]: string;
    };
    permissions: {
        [key: string]: boolean;
    };
    actions: Action[];
    features: {
        [key: string]: boolean;
    };
    onUpdate: (updatedUsers: User[]) => void;
}

const TeamCard = ({
    users,
    translations,
    permissions,
    actions,
    features,
    onUpdate,
}: TeamCardProps) => {
    const handleRowUpdate = (index: number, roles: User["roles"]) => {
        const updated = [...users];
        updated[index] = {
            ...updated[index],
            roles,
        };

        onUpdate(updated);
    };

    return users.map((user, index) => (
        <Paper key={user.id} sx={{ mb: 2 }}>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                    }}>
                    <Typography fontWeight={600}>
                        {user.firstname
                            ? `${user.firstname} ${user.lastname}`
                            : user.name}
                    </Typography>

                    <TableActionCell actions={actions} user={user} />
                </Box>

                <Grid container sx={{ p: 1 }}>
                    {ROLE_SECTIONS.filter(section =>
                        section.feature ? features[section.feature] : true
                    ).map(section => (
                        <Grid
                            key={section.id}
                            sx={{ mb: 4 }}
                            size={{ mobile: 12, tablet: 6 }}>
                            <TooltipIcon
                                boxSx={{ justifyContent: "flex-start" }}
                                label={translations[section.label]}
                                content={
                                    <PermissionDescriptions
                                        roles={section.roles.map(r => r.name)}
                                    />
                                }
                            />

                            <PermissionCheckboxes
                                row={{ original: user, index }}
                                translations={translations}
                                permissions={permissions}
                                checkboxes={section.roles.map(role => ({
                                    name: role.name,
                                    disabled: role.permission
                                        ? !permissions[role.permission]
                                        : false,
                                }))}
                                onUpdate={handleRowUpdate}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Paper>
    ));
};

export default TeamCard;
