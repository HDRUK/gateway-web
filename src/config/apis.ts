const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
const apiV1Url = `${process.env.NEXT_PUBLIC_API_V1_URL}/${apiVersion}`;
const apiV1IPUrl =
    process.env.NODE_ENV === "development"
        ? `${process.env.NEXT_PUBLIC_API_V1_IP_URL}/${apiVersion}`
        : `${process.env.NEXT_PUBLIC_API_V1_URL}/${apiVersion}`;

const apiServiceUrl = `${process.env.NEXT_PUBLIC_API_V1_URL}/services`;

const apis = {
    apiV1Url,
    apiV1IPUrl,
    logoutInternalUrl: "/api/logout",
    signInInternalUrl: "/api/signIn",
    authInternalUrl: "/api/auth",
    signInV1UrlIP: `${apiV1IPUrl}/auth`,
    usersV1UrlIP: `${apiV1IPUrl}/users`,
    authGoogleV1Url: `${apiV1Url}/auth/google`,
    authLinkedinV1Url: `${apiV1Url}/auth/linkedin`,
    authAzureV1Url: `${apiV1Url}/auth/azure`,
    cohortRequestsV1Url: `${apiV1Url}/cohort_requests`,
    cohortRequestsV1UrlIP: `${apiV1IPUrl}/cohort_requests`,
    logoutV1UrlIP: `${apiV1IPUrl}/logout`,
    usersV1Url: `${apiV1Url}/users`,
    filtersV1Url: `${apiV1Url}/filters`,
    filtersV1UrlIP: `${apiV1IPUrl}/filters`,
    sectorsV1Url: `${apiV1Url}/sectors`,
    tagsV1Url: `${apiV1Url}/tags`,
    applicationsV1Url: `${apiV1Url}/applications`,
    applicationsV1UrlIP: `${apiV1IPUrl}/applications`,
    permissionsV1Url: `${apiV1Url}/permissions`,
    datasetsV1Url: `${apiV1Url}/datasets`,
    datasetsV1UrlIP: `${apiV1IPUrl}/datasets`,
    datasetsExportV1Url: `${apiV1Url}/datasets/export`,
    structuralMetadataExportV1Url: `${apiV1Url}/datasets/export/mock?type=template_dataset_structural_metadata`,
    dataUseV1Url: `${apiV1Url}/dur`,
    dataUseV1UrlIP: `${apiV1IPUrl}/dur`,
    dataUseExportV1Url: `${apiV1Url}/dur/export`,
    dataCustodianNetworkV1Url: `${apiV1Url}/data_provider_colls`,
    dataCustodianNetworkV1UrlIP: `${apiV1IPUrl}/data_provider_colls`,
    publicationsV1Url: `${apiV1Url}/publications`,
    publicationsV1UrlIP: `${apiV1IPUrl}/publications`,
    toolsV1Url: `${apiV1Url}/tools`,
    toolsV1UrlIP: `${apiV1IPUrl}/tools`,
    teamsV1Url: `${apiV1Url}/teams`,
    teamsV1UrlIP: `${apiV1IPUrl}/teams`,
    wordPressApiUrl: `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`,
    searchV1Url: `${apiV1Url}/search`,
    saveSearchesV1Url: `${apiV1Url}/saved_searches`,
    collectionsV1Url: `${apiV1Url}/collections`,
    collectionsV1UrlIP: `${apiV1IPUrl}/collections`,
    reducedCollectionsV1UrlIP: `${apiV1IPUrl}/reduced-collections`,
    questionBankV1Url: `${apiServiceUrl}/darq`,
    darasV1Url: `${apiServiceUrl}/daras`,
    formHydrationV1Url: `${apiV1Url}/form_hydration`,
    formHydrationV1UrlIP: `${apiV1IPUrl}/form_hydration`,
    keywordsV1Url: `${apiV1Url}/keywords`,
    categoriesV1Url: `${apiV1Url}/categories`,
    fileUploadV1Url: `${apiV1Url}/files`,
    fileProcessedV1Url: `${apiV1Url}/files/processed`,
    librariesV1Url: `${apiV1Url}/libraries`,
    librariesV1UrlIP: `${apiV1IPUrl}/libraries`,
    toolCategoriesV1Url: `${apiV1Url}/type_categories`,
    programmingLanguagesV1Url: `${apiV1Url}/programming_languages`,
    enquiryThreadsV1Url: `${apiV1Url}/enquiry_threads`,
    doiSearchV1Url: `${apiV1Url}/search/doi`,
};

export default apis;
