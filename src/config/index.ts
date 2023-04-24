const apiV1 = process.env.API_V1_URL || "http://localhost:8000/api/v1";

const config = {
    authGoogleV1Url: `${apiV1}/auth/google`,
    authLinkedinV1Url: `${apiV1}/auth/linkedin`,
    authAzureV1Url: `${apiV1}/auth/azure`,
    filtersV1Url: `${apiV1}/filters`,
    tagsV1Url: `${apiV1}/tags`,
};

export default config;
