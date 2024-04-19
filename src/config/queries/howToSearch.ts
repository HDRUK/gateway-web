const GetHowToSearchQuery = `
query GetHowToSearchQuery {
  page(id: "how-to-search-the-gateway", idType: URI) {
    id
    title
    content
  }
}
`;

export { GetHowToSearchQuery };
