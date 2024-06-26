import { useMemo } from "react";
import { Control, FieldArrayWithId, FieldValues } from "react-hook-form";
import { IconButton } from "@mui/material";
import { AddTeamMember, UserAndRoles } from "@/interfaces/AddTeamMember";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import { SelectOptionsType } from "@/components/Select/Select";
import {
    addTeamMemberFormFields,
    getRoleOptions,
} from "@/config/forms/addTeamMember";
import { AddIcon, RemoveIcon, SearchRoundedIcon } from "@/consts/icons";

interface AddTeamMemberRowsProps<TFieldValues extends FieldValues> {
    fields: FieldArrayWithId<AddTeamMember, "userAndRoles", "id">[];
    control: Control<TFieldValues>;
    userOptions: SelectOptionsType[];
    userPermissions: { [key: string]: boolean };
    remove: (fieldId: number) => void;
    append: (newRow: UserAndRoles) => void;
}

const AddTeamMemberRows = <TFieldValues extends FieldValues>({
    fields,
    control,
    userOptions,
    userPermissions,
    remove,
    append,
}: AddTeamMemberRowsProps<TFieldValues>) => {
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
                                    aria-label="Remove row"
                                    onClick={() => remove(index)}>
                                    <RemoveIcon />
                                </IconButton>
                            )}
                            <IconButton
                                disableRipple
                                size="large"
                                edge="start"
                                aria-label="Remove row"
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
