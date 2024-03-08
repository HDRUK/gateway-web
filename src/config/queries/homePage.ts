const GetHomePageQuery = `
query GetHomePageQuery {
  page(id: "home-page", idType: URI) {
    id    
    template {
      ... on HomeTemplate {
        __typename
        ... on HomeTemplate {
          homeFields { 
            gatewayVideo
            gatewayVideoHeader
            logos {
              organisationCharity
              websiteAddress
              imageLocation {
                node {
                mediaItemUrl
                }
              }
            }
          }
        }
        meetTheTeam {
          sectionName
          title
          intro
          image {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
    }
  }
}
`;

export { GetHomePageQuery };
