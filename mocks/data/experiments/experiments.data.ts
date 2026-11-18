import { faker } from "@faker-js/faker";
import { AdminExperiment } from "@/interfaces/Experiment";

export const generateExperiment = (
    overrides: Partial<AdminExperiment> = {}
) => {
    const experiment: AdminExperiment = {
        id: faker.datatype.number(),
        name: faker.lorem.words(3),
        status: "draft",
        definition: {
            steps: [
                {
                    id: "step-1",
                    blocks: [
                        {
                            id: "score",
                            type: "rating",
                            variant: "faces",
                            max: 5,
                            label: faker.lorem.sentence(),
                        },
                    ],
                },
            ],
        },
        targeting: {
            paths: ["/en/search"],
            audience: "all",
            percentage: 100,
        },
        trigger: { on: "load", frequency: "untilAnswered" },
        starts_at: null,
        ends_at: null,
        responses_count: 0,
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
        ...overrides,
    };

    return experiment;
};
