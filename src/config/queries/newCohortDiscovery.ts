const GetNewCohortDiscoveryQuery = `
query GetNewCohortDiscoveryQuery {
  page(id: "new-cohort-discovery-landing", idType: URI) {
      id
      title
      template {
        __typename
        ... on CohortDiscoveryTemplate {
          newCohortDiscoveryFieldGroup { 
            firstPageText
            firstPageMedia
            secondPageText
            secondPageMedia
            thirdPageText
            thirdPageMedia
            thirdPageTextPartTwo
            fourthPageText
            fourthPageMedia
            }
        }
    }
  }
}
`;

export { GetNewCohortDiscoveryQuery };
