export interface FormPermissions {
    name: string;
    id: number;
    value: boolean;
}

export interface AppPermissionCrud {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

export interface AppPermissionDefaultValues {
    datasets: AppPermissionCrud;
    dur: AppPermissionCrud;
    tools: AppPermissionCrud;
    collections: AppPermissionCrud;
}

const defaultValues: AppPermissionDefaultValues = {
    datasets: {
        read: false,
        create: false,
        update: false,
        delete: false,
    },
    dur: {
        read: false,
        create: false,
        update: false,
        delete: false,
    },
    tools: {
        read: false,
        create: false,
        update: false,
        delete: false,
    },
    collections: {
        read: false,
        create: false,
        update: false,
        delete: false,
    },
};

export { defaultValues as appPermissionsDefaultValues };
