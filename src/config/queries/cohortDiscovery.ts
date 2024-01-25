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
`;

export { GetCohortDiscoveryQuery };
