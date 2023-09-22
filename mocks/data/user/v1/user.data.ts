import { faker } from "@faker-js/faker";
import { User } from "@/interfaces/User";
import { Role } from "@/interfaces/Role";
import { Permission } from "@/interfaces/Permission";
import { ROLE_CUSTODIAN_TEAM_ADMIN } from "@/consts/roles";

const generatePermissionV1 = (data = {}): Permission => {
    return {
        allowed_from_apps: faker.datatype.number(),
        description: faker.datatype.number(),
        id: faker.datatype.number(),
        name: faker.helpers.arrayElement(["applications.read"]),
        pivot: {
            role_id: faker.datatype.number(),
            permission_id: faker.datatype.number(),
        },
        permission_id: faker.datatype.number(),
        role_id: faker.datatype.number(),
        ...data,
    };
};

const generateRoleV1 = (data = {}): Role => {
    return {
        id: faker.datatype.number(),
        name: faker.helpers.arrayElement([ROLE_CUSTODIAN_TEAM_ADMIN]),
        pivot: {
            role_id: faker.datatype.number(),
            team_has_user_id: faker.datatype.number(),
        },
        team_has_user_id: faker.datatype.boolean(),
        enabled: faker.datatype.boolean(),
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
        role_id: faker.datatype.number(),
        permissions: Array.from({ length: 3 }).map(() =>
            generatePermissionV1()
        ),
        ...data,
    };
};

const generateUserV1 = (data = {}): User => {
    return {
        id: faker.datatype.number(),
        email: faker.internet.email(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        name: faker.datatype.string(),
        provider: faker.datatype.string(),
        providerId: faker.datatype.number(),
        roles: Array.from({ length: 3 }).map(() => generateRoleV1()),
        ...data,
    };
};

const userV1 = generateUserV1();
const permissionV1 = generatePermissionV1();
const roleV1 = generateRoleV1();

export {
    generateUserV1,
    generatePermissionV1,
    generateRoleV1,
    userV1,
    permissionV1,
    roleV1,
};
