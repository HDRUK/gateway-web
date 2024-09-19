const GetNewsQuery = `
  query GetNews {
    posts(where:{categoryName: "News"}) {
      edges {
        node {
          postId,
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

export { GetNewsQuery };
