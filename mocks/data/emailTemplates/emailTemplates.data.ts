import { faker } from "@faker-js/faker";
import { EmailTemplate } from "@/interfaces/EmailTemplate";

export const generateEmailTemplate = (
    overrides: Partial<EmailTemplate> = {}
) => {
    const template: EmailTemplate = {
        id: faker.datatype.number(),
        identifier: faker.lorem.slug(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        enabled: true,
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
        deleted_at: null,
        ...overrides,
    };

    return template;
};
