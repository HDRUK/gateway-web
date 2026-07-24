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
            firstPageSteps {
              stepTitle
              stepText
              marker
              buttonKey
            }
            secondPageText
            secondPageMedia
            secondPageSteps {
              stepTitle
              stepText
              marker
              buttonKey
            }
            thirdPageText
            thirdPageMedia
            thirdPageTextPartTwo
            fourthPageText
            fourthPageMedia
            fourthPageSteps {
              stepTitle
              stepText
              marker
              buttonKey
            }
            }
        }
    }
  }
}
`;

export { GetNewCohortDiscoveryQuery };
