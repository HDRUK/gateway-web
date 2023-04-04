import { User } from "@/interfaces";
import { faker } from "@faker-js/faker";

const generateUserV1 = (data = {}): User => {
	return {
		firstname: faker.name.firstName(),
		lastname: faker.name.lastName(),
		...data,
	};
};

const userV1 = generateUserV1();

export { generateUserV1, userV1 };
