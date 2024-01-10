const GetCohortTermsAndConditionsQuery = `
query GetCohortTermsAndConditionsQuery {
  page(id: "cohort-terms-and-conditions", idType: URI) {
    id
    title
    template {
      __typename
      ... on RepeatTemplate {
        repeatFields { 
          title
          subTitle
          description
        }
      }
    }
  }
}
`;

export { GetCohortTermsAndConditionsQuery };
