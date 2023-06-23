const apiV1 = process.env.API_V1_URL || "http://localhost:8000/api/v1";

const vars = {
    authGoogleV1Url: `${apiV1}/auth/google`,
    authLinkedinV1Url: `${apiV1}/auth/linkedin`,
    authAzureV1Url: `${apiV1}/auth/azure`,
    authRegisterV1Url: `${apiV1}/register`,
    authUsernameV1Url: `${apiV1}/auth`,
    logoutV1Url: `${apiV1}/logout`,
    logoutInternalUrl: `/api/logout`,
    filtersV1Url: `${apiV1}/filters`,
    sectorsV1Url: `${apiV1}/sectors`,
    usersV1Url: `${apiV1}/users`,
    tagsV1Url: `${apiV1}/tags`,
    wordPressApiUrl:
        process.env.WORDPRESS_API_URL ||
        "https://wordpresspoc-pljgro4dzq-ew.a.run.app/graphql",
};

export default vars;
