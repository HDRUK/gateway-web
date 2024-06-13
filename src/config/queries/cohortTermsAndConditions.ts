const GetCohortTermsAndConditionsQuery = `
query GetCohortTermsAndConditionsQuery {
  page(id: "cohort-terms-and-conditions", idType: URI) {
    id
    title
    template {
      __typename
      ... on RepeatTemplate {
        repeatfields { 
          title
          subTitle
          description
          contents {
            label
            content
          }
        }
      }
    }
  }
}
`;

export { GetCohortTermsAndConditionsQuery };
