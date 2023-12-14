const GetCohortDiscoveryQuery = `
query GetCohortDiscoveryQuery {
  pages(where: { title: "Cohort Discovery Landing" }) {
    nodes {
      id
      title
      template {
        __typename
        ... on PageTemplate1 {
          template1Fields { 
            bannerTitle
            ctaLink {
              target
              url
              title
            }
            topRightPanel
            topLeftPanel
            middlePanel
          }
        }
      }
    }
  }
}
`;

export { GetCohortDiscoveryQuery };
