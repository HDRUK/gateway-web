import { useMemo } from "react";
import { FormControlLabel, FormGroup } from "@mui/material";
import { Table } from "@tanstack/react-table";
import { User } from "@/interfaces/User";
import StyledCheckbox from "@/components/StyledCheckbox";
import { rolesMeta } from "@/consts/roles";

interface PermissionCheckboxesProps {
    row: { original: User; index: number };
    translations: { [key: string]: string };
    permissions: { [key: string]: boolean };
    checkboxes: { name: string; disabled: boolean }[];
    onUpdate?: (index: number, roles: User["roles"]) => void;
    table?: Table<User>;
}

const PermissionCheckboxes = ({
    row: { index, original },
    table,
    onUpdate,
    checkboxes,
    permissions,
    translations,
}: PermissionCheckboxesProps) => {
    const { roles } = original;

    const isLastRole = useMemo(
        () => roles?.filter(role => role.enabled).length === 1,
        [roles]
    );

    const lastRoleMessage = permissions["roles.cta.update"]
        ? translations.lastRoleAdminMessage
        : translations.lastRoleMessage;

    const checkboxesHydrated = useMemo(() => {
        return checkboxes.map(checkbox => {
            const value = !!roles?.find(role => role.name === checkbox.name)
                ?.enabled;
            return {
                name: checkbox.name,
                disabled: value && isLastRole ? true : checkbox.disabled,
                value,
                title:
                    value && isLastRole
                        ? lastRoleMessage
                        : checkbox.disabled
                        ? translations.noPermission
                        : "",
            };
        });
    }, [roles, checkboxes]);

    const handleUpdate = (name: string, value: boolean) => {
        const filteredRoles = roles.filter(role => role.name !== name);

        const updatedRoles = [
            ...filteredRoles,
            {
                name,
                enabled: value,
            },
        ];

        if (onUpdate) {
            onUpdate(index, updatedRoles);
        } else {
            table?.options.meta?.updateData(index, "roles", updatedRoles);
        }
    };

    return (
        <FormGroup>
            {checkboxesHydrated.map(checkbox => (
                <FormControlLabel
                    key={checkbox.name}
                    label={rolesMeta[checkbox.name].label}
                    title={checkbox.title}
                    control={
                        <StyledCheckbox
                            disabled={checkbox.disabled}
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                            name={checkbox.name}
                            checked={checkbox.value}
                            value={checkbox.value}
                            onChange={e =>
                                handleUpdate(checkbox.name, e.target.checked)
                            }
                        />
                    }
                />
            ))}
        </FormGroup>
    );
};

export default PermissionCheckboxes;
