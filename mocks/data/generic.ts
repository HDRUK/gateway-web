import { faker } from "@faker-js/faker";

const generateNumber = () => faker.datatype.number();
const generateFullName = () => faker.name.fullName();

export { generateNumber, generateFullName };
