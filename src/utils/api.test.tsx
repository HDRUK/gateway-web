import {
    deleteMutateData,
    deleteOptimisticData,
    ThrowPaginationError,
    putMutateData,
    putOptimisticData,
    postMutateData,
    postOptimisticData,
} from "@/utils/api";

describe("Api utils", () => {
    const singleItem = { id: 1 };
    const listWithoutPagination = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const listWithPagination = {
        list: [{ id: 1 }, { id: 2 }, { id: 3 }],
        lastPage: 2,
    };
    describe("deleteMutateData", () => {
        it("single item", () => {
            const response = deleteMutateData({
                options: undefined,
                data: singleItem,
                id: 2,
            });
            expect(response).toEqual({});
        });
        it("without pagination", () => {
            const response = deleteMutateData({
                options: undefined,
                data: listWithoutPagination,
                id: 2,
            });
            expect(response).toEqual([{ id: 1 }, { id: 3 }]);
        });
        it("with pagination", () => {
            const response = deleteMutateData({
                options: { withPagination: true },
                data: listWithPagination,
                id: 2,
            });
            expect(response).toEqual({
                list: [{ id: 1 }, { id: 3 }],
                lastPage: 2,
            });
        });
    });
    describe("deleteOptimisticData", () => {
        it("single item", () => {
            const response = deleteOptimisticData({
                options: undefined,
                data: singleItem,
                id: 2,
            });
            expect(response).toEqual({});
        });
        it("without pagination", () => {
            const response = deleteOptimisticData({
                options: undefined,
                data: listWithoutPagination,
                id: 2,
            });
            expect(response).toEqual([{ id: 1 }, { id: 3 }]);
        });
        it("with pagination", () => {
            const response = deleteOptimisticData({
                options: { withPagination: true },
                data: listWithPagination,
                id: 2,
            });
            expect(response).toEqual({
                list: [{ id: 1 }, { id: 3 }],
                lastPage: 2,
            });
        });
    });
    describe("postOptimisticData", () => {
        it("single item", () => {
            const response = postOptimisticData({
                options: undefined,
                data: {},
                payload: { name: "one" },
            });
            expect(response).toEqual({ name: "one" });
        });
        it("without pagination", () => {
            const response = postOptimisticData({
                options: undefined,
                data: listWithoutPagination,
                payload: { name: "four" },
            });
            expect(response).toEqual([
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { name: "four" },
            ]);
        });
        it("with pagination", () => {
            const response = postOptimisticData({
                options: { withPagination: true },
                data: listWithPagination,
                payload: { name: "four" },
            });
            expect(response).toEqual({
                list: [{ id: 1 }, { id: 2 }, { id: 3 }],
                lastPage: 2,
            });
        });
    });
    describe("postMutateData", () => {
        it("single item", () => {
            const response = postMutateData({
                options: undefined,
                data: {},
                payload: { name: "one" },
                id: 4,
            });
            expect(response).toEqual({ name: "one", id: 4 });
        });
        it("without pagination", () => {
            const response = postMutateData({
                options: undefined,
                data: listWithoutPagination,
                payload: { name: "four" },
                id: 4,
            });
            expect(response).toEqual([
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { name: "four", id: 4 },
            ]);
        });
        it("with pagination", () => {
            const response = postMutateData({
                options: { withPagination: true },
                data: listWithPagination,
                payload: { name: "four" },
                id: 4,
            });
            expect(response).toEqual({
                list: [{ id: 1 }, { id: 2 }, { id: 3 }],
                lastPage: 2,
            });
        });
    });
    describe("putOptimisticData", () => {
        it("single item", () => {
            const response = putOptimisticData({
                options: undefined,
                data: {},
                payload: { name: "updated", id: 2 },
            });
            expect(response).toEqual({ name: "updated", id: 2 });
        });
        it("without pagination", () => {
            const response = putOptimisticData({
                options: undefined,
                data: listWithoutPagination,
                payload: { id: 2, name: "updated" },
            });
            expect(response).toEqual([
                { id: 1 },
                { id: 2, name: "updated" },
                { id: 3 },
            ]);
        });
        it("with pagination", () => {
            const response = putOptimisticData({
                options: { withPagination: true },
                data: listWithPagination,
                payload: { id: 2, name: "updated" },
            });
            expect(response).toEqual({
                list: [{ id: 1 }, { id: 2, name: "updated" }, { id: 3 }],
                lastPage: 2,
            });
        });
    });
    describe("putMutateData", () => {
        it("single item", () => {
            const response = putMutateData({
                options: undefined,
                data: {},
                payload: { name: "updated", id: 2 },
            });
            expect(response).toEqual({ name: "updated", id: 2 });
        });
        it("without pagination", () => {
            const response = putMutateData({
                options: undefined,
                data: listWithoutPagination,
                payload: { id: 2, name: "updated" },
            });
            expect(response).toEqual([
                { id: 1 },
                { id: 2, name: "updated" },
                { id: 3 },
            ]);
        });
        it("with pagination", () => {
            const response = putMutateData({
                options: { withPagination: true },
                data: listWithPagination,
                payload: { id: 2, name: "updated" },
            });
            expect(response).toEqual({
                list: [{ id: 1 }, { id: 2, name: "updated" }, { id: 3 }],
                lastPage: 2,
            });
        });
    });
    describe("ThrowPaginationError", () => {
        it("show throw if withPagination passed but not paginationKey", () => {
            expect(() => {
                ThrowPaginationError({ withPagination: true });
            }).toThrowError(
                "You must provide both paginationKey and withPagination=true"
            );
        });
        it("show throw if paginationKey passed but not paginationKey", () => {
            expect(() => {
                ThrowPaginationError({ paginationKey: "key" });
            }).toThrowError(
                "You must provide both paginationKey and withPagination=true"
            );
        });
    });
});
