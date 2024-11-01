const GetContributorsAndCollaboratorsQuery = `
query GetContributorsAndCollaborators {
  posts(where: {name: "meet-the-stakeholders"}) {
    edges {
      node {
        title
        id
        contributorsAndCollaborators {
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
