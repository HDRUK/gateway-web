const GetTermsAndConditionsQuery = `
query GetTermsAndConditionsQuery {
  pages(where: { id: 171 }) {
    nodes {
      id
      title
      content      
    }
  }
}
`;

export { GetTermsAndConditionsQuery };
