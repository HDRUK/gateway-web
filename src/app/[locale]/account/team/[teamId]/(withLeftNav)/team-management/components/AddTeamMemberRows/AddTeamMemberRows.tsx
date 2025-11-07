import { useMemo } from "react";
import { Control, FieldArrayWithId, FieldValues } from "react-hook-form";
import { IconButton } from "@mui/material";
import { AddTeamMember, UserAndRoles } from "@/interfaces/AddTeamMember";
import { AuthUser } from "@/interfaces/AuthUser";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    addTeamMemberFormFields,
    getRoleOptions,
} from "@/config/forms/addTeamMember";
import { AddIcon, RemoveIcon, SearchRoundedIcon } from "@/consts/icons";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import { getAvailableUsers } from "../AddTeamMemberDialog/AddTeamMemberDialog.utils";

interface AddTeamMemberRowsProps<TFieldValues extends FieldValues> {
    fields: FieldArrayWithId<AddTeamMember, "userAndRoles", "id">[];
    control: Control<TFieldValues>;
    userPermissions: { [key: string]: boolean };
    remove: (fieldId: number) => void;
    append: (newRow: UserAndRoles) => void;
    onInputChangeUser?: (value: string) => void;
    user: AuthUser;
    team: {
        users: User[];
    };
}

const AddTeamMemberRows = <TFieldValues extends FieldValues>({
    fields,
    control,
    team,
    user,
    remove,
    append,
    onInputChangeUser,
}: AddTeamMemberRowsProps<TFieldValues>) => {
    const teamUser = useMemo(() => {
        return getTeamUser(team.users, user.id);
    }, [team, user]);

    const userPermissions = useMemo(() => {
        return getPermissions(user.roles, teamUser?.roles);
    }, [team, user]);

    // TODO: switch to typeahead propery
    // - difficult due to use of useFieldArray and shared options
    // - defaulting to full list of all users as a temporary measure..
    // const [searchName, setSearchName] = useState("");
    // const searchNameDebounced = useDebounce(searchName, 500);
    const { data: users = [], isLoading: isLoadingUsers } = useGet<User[]>(
        `${apis.usersV1Url}?mini`, // filterNames=${searchNameDebounced}`,
        {
            shouldFetch: true, // !!searchNameDebounced
        }
    );

    const userOptions = useMemo(() => {
        return getAvailableUsers(team.users, users);
    }, [team, users]);

    const roleOptionsFiltered = useMemo(() => {
        return getRoleOptions().filter(role =>
            role.permissions?.every(permission => userPermissions[permission])
        );
    }, [userPermissions]);

    const [userField, memberField] = addTeamMemberFormFields;
    return (
        <Box sx={{ p: 0, width: "100%" }}>
            {fields.map((field, index) => {
                return (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            p: 0,
                            gap: 2,
                        }}
                        key={field.id}>
                        <Box sx={{ p: 0, gridColumn: "span 3" }}>
                            <InputWrapper
                                {...userField}
                                {...(index > 0 && { label: "" })}
                                name={`userAndRoles.${index}.userId`}
                                control={control}
                                icon={SearchRoundedIcon}
                                options={userOptions}
                                onInputChange={onInputChangeUser}
                                isLoadingOptions={isLoadingUsers}
                            />
                        </Box>
                        <Box sx={{ p: 0, gridColumn: "span 3" }}>
                            <InputWrapper
                                {...memberField}
                                {...(index > 0 && { label: "" })}
                                name={`userAndRoles.${index}.roles`}
                                control={control}
                                options={roleOptionsFiltered}
                            />
                        </Box>

                        <Box
                            sx={{
                                mr: 5,
                                p: 0,
                                gridColumn: "span 1",
                                display: "flex",
                            }}>
                            {fields.length > 1 && (
                                <IconButton
                                    disableRipple
                                    size="large"
                                    edge="start"
                                    aria-label="Remove team member"
                                    onClick={() => remove(index)}>
                                    <RemoveIcon />
                                </IconButton>
                            )}
                            <IconButton
                                disableRipple
                                size="large"
                                edge="start"
                                aria-label="Add team member"
                                onClick={() =>
                                    append({
                                        userId: undefined,
                                        roles: [],
                                    })
                                }>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default AddTeamMemberRows;
