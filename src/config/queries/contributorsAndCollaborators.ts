const GetContributorsAndCollaboratorsQuery = `
query GetContributorsAndCollaborators {
  posts(where: {name: "collaborators-contributors"}) {
    edges {
      node {
        title
        id
        contributorsCollaborators {
          summaryText
          teamList {
            info
            name
            jobTitle
            image {
              node {
                sourceUrl
                uri
                altText
                title
                id
              }
            }
          }
        }
      }
    }
  }
}`;

export { GetContributorsAndCollaboratorsQuery };
