const GetHomePageQuery = `
query GetHomePageQuery {
  page(id: "home-page", idType: URI) {
    id    
    title
    content
    template {
      ... on HomeTemplate {
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
