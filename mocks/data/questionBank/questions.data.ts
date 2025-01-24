import { faker } from "@faker-js/faker";
import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";

export const generateQuestionBankQuestion = () => {
    const question: QuestionBankQuestion = {
        question_id: faker.datatype.number(),
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
        deleted_at: null,
        section_id: faker.datatype.number(),
        user_id: faker.datatype.number(),
        locked: faker.datatype.boolean(),
        required: faker.datatype.boolean(),
        force_required: faker.datatype.boolean(),
        allow_guidance_override: faker.datatype.boolean(),
        version_id: faker.datatype.number(),
        title: faker.lorem.word(),
        guidance: faker.lorem.paragraph(),
        component: "TextArea",
        default: faker.datatype.boolean(),
        archived: false,
        archived_date: null,
        is_child: faker.datatype.number({ min: 0, max: 1 }),
        question_type: faker.lorem.word(),
        options: [],
    };

    return question;
};
