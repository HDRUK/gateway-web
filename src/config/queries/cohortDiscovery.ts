const GetCohortDiscoveryQuery = `
query GetCohortDiscoveryQuery {
  page(id: "cohort-discovery-landing", idType: URI) {
      id
      title
      template {
        __typename
        ... on PromoTemplate {
          promofields { 
            bannerTitle
            topRightPanel
            topLeftPanel
            middlePanel
            bottomPanel
          }
        }
    }
  }
}
`;

export { GetCohortDiscoveryQuery };
