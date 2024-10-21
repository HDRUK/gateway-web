const GetReleaseNotesQuery = `
  query GetReleaseNotes {
    posts(where:{categoryName: "releaseNotes"}) {
      edges {
        node {
          title
          content
          date 
          id
          release {
            releaseDate
          }
        }
      }
    }
  }
  `;

export { GetReleaseNotesQuery };
