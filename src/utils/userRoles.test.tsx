import { generateRoleV1, generateUserV1 } from "@/mocks/data";
import {
    findUserById,
    filterEnabledRoles,
    getChangedRoles,
    getDifferences,
    getChangeCount,
} from "./userRoles";

describe("UserRoles utils", () => {
    describe("findUserById", () => {
        const mockUser = generateUserV1({ id: 1, name: "User1" });

        it("should find a user by Id", () => {
            expect(findUserById([mockUser], 1)).toEqual(mockUser);
        });

        it("should return undefined for a non-existing user", () => {
            expect(findUserById([mockUser], 3)).toBeUndefined();
        });
    });

    describe("filterEnabledRoles", () => {
        const mockUsers = [
            generateUserV1({
                id: 1,
                roles: [generateRoleV1({ enabled: false, name: "Role1" })],
            }),
        ];

        it("should not send role with value 'false' if it was not present in received payload", () => {
            expect(
                filterEnabledRoles(
                    [
                        generateRoleV1({
                            enabled: true,
                            name: "Role1",
                        }),
                        generateRoleV1({
                            enabled: false,
                            name: "Role2",
                        }),
                    ],
                    1,
                    mockUsers
                )
            ).toEqual({
                Role1: true,
            });
        });
    });

    describe("getChangedRoles", () => {
        it("should return changed roles", () => {
            const initialRoles = { Role1: true, Role2: false };
            const updatedRoles = { Role1: false, Role2: true, Role3: false };

            expect(getChangedRoles(initialRoles, updatedRoles)).toEqual({
                Role1: false,
                Role2: true,
                Role3: false,
            });
        });

        it("should return an empty object if no roles changed", () => {
            const initialRoles = { Role1: true, Role2: false };
            const updatedRoles = { Role1: true, Role2: false };

            expect(getChangedRoles(initialRoles, updatedRoles)).toEqual({});
        });
    });

    describe("getDifferences", () => {
        it("should return changed and all roles", () => {
            const originalUsers = [
                generateUserV1({
                    id: 1,
                    roles: [
                        generateRoleV1({ enabled: true, name: "Role1" }),
                        generateRoleV1({ enabled: false, name: "Role2" }),
                    ],
                }),
            ];

            const updatedUsers = [
                generateUserV1({
                    id: 1,
                    roles: [
                        generateRoleV1({ enabled: false, name: "Role1" }),
                        generateRoleV1({ enabled: true, name: "Role2" }),
                        generateRoleV1({ enabled: false, name: "Role3" }),
                        generateRoleV1({ enabled: true, name: "Role4" }),
                    ],
                }),
            ];

            expect(getDifferences(updatedUsers, originalUsers)).toEqual({
                changedRoles: [
                    {
                        userId: 1,
                        roles: { Role1: false, Role2: true, Role4: true },
                    },
                ],
                allRoles: [
                    {
                        userId: 1,
                        roles: {
                            Role1: false,
                            Role2: true,
                            Role4: true,
                        },
                    },
                ],
            });
        });

        it("should return empty arrays if no roles changed", () => {
            expect(
                getDifferences(
                    [
                        generateUserV1({
                            id: 1,
                            roles: [
                                generateRoleV1({
                                    enabled: true,
                                    name: "Role1",
                                }),
                            ],
                        }),
                    ],
                    [
                        generateUserV1({
                            id: 1,
                            roles: [
                                generateRoleV1({
                                    enabled: true,
                                    name: "Role1",
                                }),
                            ],
                        }),
                    ]
                )
            ).toEqual({
                changedRoles: [],
                allRoles: [],
            });
        });
    });

    describe("getChangeCount", () => {
        it("should return the total number of changed roles", () => {
            const payloads = [
                { userId: 1, roles: { Role1: true, Role2: false } },
                { userId: 2, roles: { Role1: true, Role2: true } },
            ];

            expect(getChangeCount(payloads)).toBe(4);
        });

        it("should return 0 for an empty array", () => {
            expect(getChangeCount([])).toBe(0);
        });
    });
});
