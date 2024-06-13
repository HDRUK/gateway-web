import * as yup from "yup";

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

const validationSchema = yup
    .object({
        datasets: yup.object({
            read: yup.boolean().required(),
            create: yup.boolean().required(),
            update: yup.boolean().required(),
            delete: yup.boolean().required(),
        }),
        dur: yup.object({
            read: yup.boolean().required(),
            create: yup.boolean().required(),
            update: yup.boolean().required(),
            delete: yup.boolean().required(),
        }),
        tools: yup.object({
            read: yup.boolean().required(),
            create: yup.boolean().required(),
            update: yup.boolean().required(),
            delete: yup.boolean().required(),
        }),
        collections: yup.object({
            read: yup.boolean().required(),
            create: yup.boolean().required(),
            update: yup.boolean().required(),
            delete: yup.boolean().required(),
        }),
    })
    .test(
        "custom",
        "One checkbox must be true",
        (value: AppPermissionDefaultValues) => {
            let isValid = false;
            Object.keys(value).forEach(permKey => {
                Object.keys(
                    value[permKey as keyof AppPermissionDefaultValues]
                ).forEach(crudKey => {
                    if (
                        value[permKey as keyof AppPermissionDefaultValues][
                            crudKey as keyof AppPermissionCrud
                        ]
                    ) {
                        isValid = true;
                    }
                });
            });
            return isValid;
        }
    );

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

export {
    validationSchema as appPermissionsValidationSchema,
    defaultValues as appPermissionsDefaultValues,
};
