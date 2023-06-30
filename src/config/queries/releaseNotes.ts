const GetReleaseNotesQuery = `
  query GetReleaseNotes {
    posts(where:{categoryName: "release-notes"}) {
      edges {
        node {
          title
          content
          date 
          id
        }
      }
    }
  }
  `;

export { GetReleaseNotesQuery };
