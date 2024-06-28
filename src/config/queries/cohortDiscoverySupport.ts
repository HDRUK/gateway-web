const GetCohortDiscoverySupportPageQuery = `
query GetCohortDiscoverySupport {
  page(id: "/support/cohort-discovery/", idType: URI) {
    id
    title
    content
    supportCohortDiscovery {
      documentation
      explainer {
        node {
          sourceUrl
        }
      }
      faqs {
        answer
        question
      }
    }
  }
}`;

export { GetCohortDiscoverySupportPageQuery };
