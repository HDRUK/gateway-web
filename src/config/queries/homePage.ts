const GetHomePageQuery = `
query GetHomePageQuery {
  page(id: "home-page", idType: URI) {
    id
    title
    content
  }
}
`;

export { GetHomePageQuery };
