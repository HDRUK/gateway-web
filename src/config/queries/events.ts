const GetEventsQuery = `
  query GetEvents {
    posts(where:{categoryName: "events"}) {
      edges {
        node {
          newsFields {
            headline
            link {
              url
              title
            }
            text
            content
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
