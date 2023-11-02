import { IconButton } from "@mui/material";
import { AddIcon, RemoveIcon, SearchRoundedIcon } from "@/consts/icons";
import InputWrapper from "@/components/InputWrapper";
import { addTeamMemberFormFields } from "@/config/forms/addTeamMember";
import Box from "@/components/Box";
import { Control, FieldArrayWithId } from "react-hook-form";
import { AddTeamMember, UserAndRoles } from "@/interfaces/AddTeamMember";
import { SelectOptionsType } from "@/components/Select/Select";

interface AddTeamMemberRowsProps {
    fields: FieldArrayWithId<AddTeamMember, "userAndRoles", "id">[];
    control: Control;
    userOptions: SelectOptionsType[];
    remove: (fieldId: number) => void;
    append: (newRow: UserAndRoles) => void;
}

const AddTeamMemberRows = ({
    fields,
    control,
    userOptions,
    remove,
    append,
}: AddTeamMemberRowsProps) => {
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
                                name={`userAndRoles.${index}.userId`}
                                control={control}
                                icon={SearchRoundedIcon}
                                options={userOptions}
                            />
                        </Box>
                        <Box sx={{ p: 0, gridColumn: "span 3" }}>
                            <InputWrapper
                                {...memberField}
                                name={`userAndRoles.${index}.roles`}
                                control={control}
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
