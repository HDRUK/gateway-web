import {
    AppPermissionCrud,
    AppPermissionDefaultValues,
} from "@/config/forms/applicationPermissions";
import { Permission } from "@/interfaces/Permission";

const getChangeCount = (changedFields: {
    [key: string]: { [key: string]: boolean };
}) => {
    return Object.keys(changedFields)
        .map(key => Object.keys(changedFields[key]).length)
        .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
};

const getPayloadPermissions = (
    updatedPermissions: AppPermissionDefaultValues,
    permissions: Permission[]
) => {
    return Object.keys(updatedPermissions).reduce((acc: number[], permKey) => {
        Object.keys(
            updatedPermissions[permKey as keyof AppPermissionDefaultValues]
        ).forEach(crudKey => {
            if (
                updatedPermissions[permKey as keyof AppPermissionDefaultValues][
                    crudKey as keyof AppPermissionCrud
                ]
            ) {
                const found = permissions?.find(
                    permission => permission.name === `${permKey}.${crudKey}`
                );
                if (found) {
                    acc.push(found.id);
                }
            }
        });
        return acc;
    }, []);
};

const getEnabledPermissions = (
    permissions: Permission[],
    defaultValues: AppPermissionDefaultValues
) => {
    const existingPermissions = {
        collections: { ...defaultValues.collections },
        tools: { ...defaultValues.tools },
        dur: { ...defaultValues.dur },
        datasets: { ...defaultValues.datasets },
    };

    permissions.forEach(permission => {
        const [permKey, crudKey] = permission.name.split(".");
        existingPermissions[permKey as keyof AppPermissionDefaultValues][
            crudKey as keyof AppPermissionCrud
        ] = true;
    });

    return existingPermissions;
};

export { getChangeCount, getPayloadPermissions, getEnabledPermissions };
