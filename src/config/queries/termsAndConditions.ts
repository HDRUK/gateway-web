const GetTermsAndConditionsQuery = `
query GetTermsAndConditionsQuery {
  page(id: "terms-and-conditions", idType: URI) {
    id
    title
    content
  }
}
`;

export { GetTermsAndConditionsQuery };
