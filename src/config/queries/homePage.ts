const GetHomePageQuery = `
query GetHomePageQuery {
  page(id: "home-page", idType: URI) {
    id    
    template {
      ... on HomeTemplate {
        __typename
        ... on HomeTemplate {
          homeFields { 
            newsHeader
            gatewayVideo
            gatewayVideoHeader
            affiliateLink {
              url
              title
            }
            logos {
              organisationCharity
              websiteAddress
              imageLocation {
                node {
                mediaItemUrl
                }
              }
            }
            newsletterSignupHeader
            newsletterSignupDescription
            newsletterSignupLink {
              url
              title
            }
          }
        }
        meetTheTeam {
          sectionName
          title
          intro
          image {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
    }
  }
    posts(first: 4, where:{categoryName: "news",  orderby: {field: DATE, order: DESC}}) {
      edges {
        node {
          title
          content
          date
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

export { GetHomePageQuery };
