import { appPermissionsDefaultValues } from "@/config/forms/applicationPermissions";
import { generatePermissionV1 } from "@/mocks/data";
import {
    getPayloadPermissions,
    getEnabledPermissions,
    getChangeCount,
} from "./ApplicationPermissions.utils";

describe("ApplicationPermissions", () => {
    const mockPermissions = [
        generatePermissionV1({ name: "tools.create", id: 1 }),
        generatePermissionV1({ name: "datasets.delete", id: 2 }),
        generatePermissionV1({ name: "dur.update", id: 3 }),
    ];
    describe("getPayloadPermissions", () => {
        it("should return IDs of enabled permissions for updated payload", () => {
            const updatedPermissions = { ...appPermissionsDefaultValues };
            updatedPermissions.tools.create = true;
            updatedPermissions.datasets.delete = true;

            const response = getPayloadPermissions(
                appPermissionsDefaultValues,
                mockPermissions
            );

            expect(response).toEqual([2, 1]);
        });
    });
    describe("getEnabledPermissions", () => {
        it("should return enabled/disabled permissions in form data format", () => {
            const mockApplicationPermissions = [...mockPermissions];
            const response = getEnabledPermissions(
                mockApplicationPermissions,
                appPermissionsDefaultValues
            );
            expect(response).toEqual({
                collections: {
                    create: false,
                    delete: false,
                    read: false,
                    update: false,
                },
                datasets: {
                    create: false,
                    delete: true,
                    read: false,
                    update: false,
                },
                dur: {
                    create: false,
                    delete: false,
                    read: false,
                    update: true,
                },
                tools: {
                    create: true,
                    delete: false,
                    read: false,
                    update: false,
                },
            });
        });
    });
    describe("getChangeCount", () => {
        it("should return count of changes", () => {
            expect(
                getChangeCount({ one: { a: true, b: false }, two: { b: true } })
            ).toEqual(3);
        });
    });
});
