import { faker } from "@faker-js/faker";
import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";

export const generateQuestionBankQuestion = () => {
    const question: QuestionBankQuestion = {
        id: faker.datatype.number(),
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
        deleted_at: null,
        section_id: faker.datatype.number(),
        user_id: faker.datatype.number(),
        team_id: faker.datatype.number(),
        locked: faker.datatype.number({ min: 0, max: 1 }),
        required: faker.datatype.number({ min: 0, max: 1 }),
        version: faker.datatype.number(),
        question_json: {
            title: faker.lorem.word(),
            guidance: faker.lorem.paragraph(),
            field: {
                component: "TextArea",
                variant: "outlined",
                name: faker.lorem.text(),
            },
        },
    };
    return question;
};
