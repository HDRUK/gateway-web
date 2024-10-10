const GetEventsQuery = `
  query GetEvents {
    posts(where:{categoryName: "events"}) {
      edges {
        node {
          postId,
          slug,
          newsFields {
            headline
            link {
              url
              title
            }
            text
            date
            image {
              node {
                mediaItemUrl
                altText
              }
            }
          }
        }
      }
    }
  }
  `;

export { GetEventsQuery };
