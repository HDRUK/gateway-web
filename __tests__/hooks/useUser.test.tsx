import { useUser } from "@/hooks";
import { userV1 } from "@/mocks/data";
import { getUserV1 } from "@/mocks/handlers/user";
import { server } from "@/mocks/server";
import { renderHook, waitFor } from "../testUtils";

describe("useUser", () => {
	it("should eventually return the user", async () => {
		const { result } = renderHook(() => useUser());

		expect(result.current).toEqual({
			error: undefined,
			user: undefined,
		});

		await waitFor(() => {
			expect(result.current.error).not.toBeDefined();
			expect(result.current.user).toEqual(userV1);
		});
	});
	it("should return error if 404 returned", async () => {
		server.use(getUserV1(undefined, 404));

		const { result } = renderHook(() => useUser());

		expect(result.current).toEqual({ error: undefined, user: undefined });

		await waitFor(() => {
			expect(result.current.user).not.toBeDefined();
			expect(result.current.error).toBeDefined();
		});
	});
});
