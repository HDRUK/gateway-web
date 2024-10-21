import { faker } from "@faker-js/faker";
import { Collection, ReducedCollection } from "@/interfaces/Collection";

const generateCollectionV1 = (data = {}): Collection | ReducedCollection => {
    return {
        name: faker.datatype.string(),
        _id: faker.datatype.uuid(),
        ...data,
    };
};

const generateLargeCollectionV1 = (data = {}): ReducedCollection => {
    return {
        id: "testId",
        name: "Neonatal Data Visualisations",
        description:
            "This tool provides insights into the neonatal health data contained within the National Neonatal Research Database (NNRD). The tools are aimed at parents, clinical teams, researchers and health service managers.  To access our NNRD Interrogation tools, please click here: https://www.imperial.ac.uk/neonatal-data-analysis-unit/neonatal-data-analysis-unit/neonatal-data-visualisations/",
        image_link: null,
        enabled: true,
    
        created_at: "2024-10-04T12:23:54.000000Z",
        updated_at: "2024-10-04T12:34:14.000000Z",
        deleted_at: null,
        mongo_object_id: "6200fe70f822e606e42f86ca",
        mongo_id: "21617238734209688",
        updated_on: null,
        team_id: null,
        status: "ACTIVE",
        keywords: [
            {
                id: 34,
                name: "NNRD",
                enabled: true,
                created_at: null,
                updated_at: "2024-10-04T12:23:54.000000Z",
                pivot: {
                    collection_id: 15,
                    keyword_id: 34,
                },
            },
            {
                id: 33,
                name: "neonatal",
                enabled: true,
                created_at: null,
                updated_at: "2024-10-04T12:23:02.000000Z",
                pivot: {
                    collection_id: 15,
                    keyword_id: 33,
                },
            },
        ],
        tools: [
            {
                id: 148,
                name: "Neonatal Data Visualisations",
                created_at: "2024-10-04T12:23:38.000000Z",
                user_id: 3242,
                pivot: {
                    collection_id: 15,
                    tool_id: 148,
                },
                user: {
                    id: 3242,
                    firstname: "Ricardo",
                    lastname: "Ribas",
                    requestroles: []
                },
            },
        ],
        dur: [
            {
                id: 564,
                project_title:
                    "Wales Multimorbidity Cohort COVID-19 Surveillance (contains 58 active research projects)",
                organisation_name: "Swansea University",
                pivot: {
                    collection_id: 5,
                    dur_id: 564,
                },
            },
        ],
        publications: [
            {
                id: 80,
                paper_title:
                    "An online decision tree for vaccine efficacy trial design during infectious disease epidemics: The InterVax-Tool.",
                authors:
                    "Bellan SE, Eggo RM, Gsell PS, Kucharski AJ, Dean NE, Donohue R, Zook M, Edmunds WJ, Odhiambo F, Longini IM, Brisson M, Mahon BE, Henao-Restrepo AM.",
                url: "https://europepmc.org/articles/PMC6620503",
                year_of_publication: "2019",
                pivot: {
                    collection_id: 3,
                    publication_id: 80,
                },
            },
        ],
        dataset_versions: [
            {
                id: 142,
                dataset_id: 143,
                shortTitle: "National Neonatal Research Database (NNRD)",
                populationSize: 1200000,
                datasetType: "Health and disease",
                pivot: {
                    collection_id: 15,
                    dataset_version_id: 142,
                },
            },
            {
                id: 143,
                dataset_id: 144,
                shortTitle:
                    "National Neonatal Research Database - Artificial Intelligence (NNRD-AI)",
                populationSize: 1270000,
                datasetType: "Health and disease",
                pivot: {
                    collection_id: 15,
                    dataset_version_id: 143,
                },
            },
        ],
        team: null,
        ...data
    }
}

const generateBadCollectionV1 = (data = {}): ReducedCollection => {
    return {
        id: "testId",
        name: "A nice name",
        description: "A lovely description",
        image_link: "https://media.preprod.hdruk.cloud/collections/404.png",
        enabled: true,
        public: 1,
        counter: 1310,
        created_at: "2024-09-06T11:42:06.000000Z",
        updated_at: "2024-09-06T11:59:10.000000Z",
        deleted_at: null,
        mongo_object_id: "5fe1e32dd1bdb74d9e831cdc",
        mongo_id: "3975719127757711",
        updated_on: null,
        team_id: null,
        status: "ACTIVE",
        user_id: null,
        keywords: [],
        tools: [],
        dur: [],
        publications: [],
        dataset_versions: [
            {
                id: 253,
                dataset_id: 253,
                shortTitle: null,
                populationSize: null,
                datasetType: null,
                pivot: {
                    collection_id: 87,
                    dataset_version_id: 253,
                },
            },
        ],
        team: null,
        ...data
    }
}

export { generateCollectionV1, generateLargeCollectionV1, generateBadCollectionV1 };
