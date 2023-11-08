const apiV1Url =
    process.env.NEXT_PUBLIC_API_V1_URL || "http://localhost:8000/api/v1";
const apiV1IPUrl =
    process.env.NEXT_PUBLIC_API_V1_IP_URL || "http://gateway-api:8000/api/v1";

const apis = {
    logoutInternalUrl: "/api/logout",
    signInInternalUrl: "/api/signIn",
    authInternalUrl: "/api/auth",
    signInV1UrlIP: `${apiV1IPUrl}/auth`,
    usersV1UrlIP: `${apiV1IPUrl}/users`,
    authGoogleV1Url: `${apiV1Url}/auth/google`,
    authLinkedinV1Url: `${apiV1Url}/auth/linkedin`,
    authAzureV1Url: `${apiV1Url}/auth/azure`,
    logoutV1Url: `${apiV1Url}/logout`,
    usersV1Url: `${apiV1Url}/users`,
    filtersV1Url: `${apiV1Url}/filters`,
    sectorsV1Url: `${apiV1Url}/sectors`,
    tagsV1Url: `${apiV1Url}/tags`,
    applicationsV1Url: `${apiV1Url}/applications`,
    permissionsV1Url: `${apiV1Url}/permissions`,
    teamsV1Url: `${apiV1Url}/teams`,
    wordPressApiUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
};

export default apis;
