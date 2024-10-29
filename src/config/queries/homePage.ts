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
    posts(first: 4, where:{categoryName: "news,events",  orderby: {field: DATE, order: DESC}}) {
      edges {
        node {
          slug
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
            date
            image {
              node {
                mediaItemUrl
                altText
              }
            }
          }
          categories {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;

const GetHomePageBanner = `
query GetHomePageBanner {
  posts(where: {categoryName: "homepage banner"}) {
    edges {
      node {
        homepageBanner {
          linkUrl
          linkText
          heading
          description
        }
      }
    }
  }
}`;

export { GetHomePageQuery, GetHomePageBanner };
