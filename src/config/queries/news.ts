const GetNewsQuery = `
  query GetNews {
    posts(where:{categoryName: "News"}) {
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

export { GetNewsQuery };
