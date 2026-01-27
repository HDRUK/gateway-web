import { faker } from "@faker-js/faker";

const generateNumber = () => faker.datatype.number();
const generateFullName = () => faker.person.fullName();

export { generateNumber, generateFullName };
