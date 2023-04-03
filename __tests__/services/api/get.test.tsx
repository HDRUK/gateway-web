import { userV1 } from "@/mocks/data";
import { apiService } from "@/services";

describe("get", () => {
	it("should return user", async () => {
		const response = await apiService.getRequest("api/user");
		expect(response).toEqual(userV1);
	});
});
