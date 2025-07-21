const GetCohortDiscoveryQuery1 = `
query GetCohortDiscoveryQuery1 {
  page(id: "new-cohort-discovery-landing", idType: URI) {
      id
      title
      template {
        __typename
        ... on CohortDiscoveryTemplate {
          newCohortDiscoveryFieldGroup { 
            ctaLink {
              target
              url
              title
            }
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

export { GetCohortDiscoveryQuery1 };
