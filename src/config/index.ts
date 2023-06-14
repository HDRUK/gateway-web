const apiV1 = process.env.API_V1_URL || "http://localhost:8000/api/v1";

const config = {
    authGoogleV1Url: `${apiV1}/auth/google`,
    authLinkedinV1Url: `${apiV1}/auth/linkedin`,
    authAzureV1Url: `${apiV1}/auth/azure`,
    logoutV1Url: `${apiV1}/logout`,
    filtersV1Url: `${apiV1}/filters`,
    sectorsV1Url: `${apiV1}/sectors`,
    usersV1Url: `${apiV1}/users`,
    tagsV1Url: `${apiV1}/tags`,
};

export default config;
