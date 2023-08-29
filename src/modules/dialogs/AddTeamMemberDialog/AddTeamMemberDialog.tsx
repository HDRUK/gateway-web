/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Dialog from "@/components/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import ModalButtons from "@/components/ModalButtons";
import Box from "@/components/Box";
import { AddTeamMember } from "@/interfaces/AddTeamMember";
import useDialog from "@/hooks/useDialog";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Checkbox, ListItemText, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/SearchRounded";
import apis from "@/config/apis";
import { Team } from "@/interfaces/Team";
import Loading from "@/components/Loading";
import useGet from "@/hooks/useGet";
import TypeAheadDropDown from "@/components/TypeAheadDropDown";
import OutlinedInput from "@mui/material/OutlinedInput";

const AddTeamMemberDialog = () => {
    const { showDialog } = useDialog();
    const { t } = useTranslation("modules");
    const router = useRouter();
    const [memberAdded, setMemberAdded] = useState(0);
    const [memberSearchName, setMemberSearchName] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);
    const { teamId } = router.query;
    const { control } = useForm<AddTeamMember>({
        // resolver: yupResolver(addTeamMemberValidationSchema),
        // defaultValues: { ...addTeamMemberDefaultValues },
    });

    const { data: teamUserList = [], isLoading: isTeamListLoading } = useGet<
        Team[]
    >(`${apis.teamsV1Url}/${teamId}`);

    if (isTeamListLoading) return <Loading />;

    const onNameChange = async (event: any) => {
        setMemberSearchName(event.target.value);
    };

    const onRoleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedRoles(typeof value === "string" ? value.split(",") : value);
    };

    const selectProps = {
        PaperProps: {
            style: {
                padding: 5,
                maxHeight: "250px",
                width: "600px",
                overflow: "wrap",
            },
        },
    };

    const roleOptions = [
        {
            value: 0,
            name: "Team Admin",
            description:
                "Can add or remove team members, and edit their roles.",
        },
        {
            value: 1,
            name: "Team Developer",
            description: "Can develop, sample copy to be updated.",
        },
        {
            value: 2,
            name: "Metadata Manager",
            description:
                "Can create and edit dataset metadata, and edit team roles related to dataset metadata.",
        },
        {
            value: 3,
            name: "Metadata Editor",
            description: "Can create and edit dataset metadata.",
        },
        {
            value: 4,
            name: "Data Access Request Manager",
            description:
                "Can review data access request applications, assign workflows to other team members, and edit team roles related to data access requests.",
        },
        {
            value: 5,
            name: "Data Access Request Reviewer",
            description:
                "Can review sections of data access request applications that have been assigned to them through workflows.",
        },
    ];

    return (
        <Dialog title={t("dialogs.AddTeamMemberDialog.title")}>
            <MuiDialogContent>
                <Typography>
                    Users that you want to add to your team must already have an
                    account on the Gateway
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        verticalAlign: "middle",
                    }}>
                    <TypeAheadDropDown
                        label="User"
                        name="user"
                        control={control}
                        icon={SearchIcon}
                        items={teamUserList}
                    />
                    <Select
                        label="Member role(s)"
                        name="roles"
                        control={control}
                        multiple
                        renderValue={selected => selected.join(", ")}
                        input={<OutlinedInput label="Tag" />}
                        MenuProps={selectProps}
                        value={selectedRoles}
                        onChange={onRoleChange}
                        sx={{
                            width: "300px",
                            height: "37px",
                            marginTop: "23px",
                        }}>
                        {roleOptions.map(role => (
                            <MenuItem key={role.name} value={role.name}>
                                <Checkbox
                                    checked={
                                        selectedRoles.indexOf(role.name) > -1
                                    }
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
                        ))}
                    </Select>
                    {memberAdded > 0 && (
                        <RemoveIcon
                            sx={{
                                marginTop: "25px",
                                marginLeft: "10px",
                                height: "32px",
                                width: "32px",
                                color: "#727372",
                            }}
                        />
                    )}
                    <AddIcon
                        sx={{
                            marginTop: "25px",
                            marginLeft: "10px",
                            width: "32px",
                            height: "32px",
                        }}
                    />
                </Box>
            </MuiDialogContent>
            <MuiDialogActions>
                <ModalButtons
                    confirmText={
                        t("dialogs.AddTeamMemberDialog.confirmButton") || ""
                    }
                    confirmType="submit"
                    cancelText={
                        t("dialogs.AddTeamMemberDialog.cancelButton") || ""
                    }
                />
            </MuiDialogActions>
        </Dialog>
    );
};

export default AddTeamMemberDialog;
