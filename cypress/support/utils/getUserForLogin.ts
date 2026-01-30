const users = {
    developers: {
        prefix: "DEV_",
    },
    custodianTeamAdmin1: {
        prefix: "CUST_ADMIN_1_",
    },
    custodianTeamAdmin2: {
        prefix: "CUST_ADMIN_2_",
    },
    developers1: {
        prefix: "DEV_1_",
    },
    custodianTeamAdmin3: {
        prefix: "CUST_ADMIN_3_",
    },
    developers2: {
        prefix: "DEV_2_",
    },
    dataAccessRequestManager: {
        prefix: "DATA_ACCESS_MANAGER_",
    },
    dataAccessRequestReviewer: {
        prefix: "DATA_ACCESS_REVIEWER_",
    },
    metadataManager: {
        prefix: "METADATA_MANAGER_",
    },
    metadataManagerEditor: {
        prefix: "METADATA_EDITOR_",
    },
    darManagerAndMetadatamanger: {
        prefix: "DAR_MANAGER_AND_METADATA_MANAGER_",
    },
};

export const getUserForLogin = (user: string) => {
    let envPrefix = users[user]?.prefix;

    if (!envPrefix) {
        console.warn("user: " + user + " not set in users defauling to DEV_");
        envPrefix = "DEV_";
    }

    return envPrefix;
};
