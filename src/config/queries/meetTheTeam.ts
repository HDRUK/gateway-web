const GetMeetTheTeamQuery = `
query GetMeetTheTeam {
  posts {
    edges {
      node {
        title
        id
        meetTheTeamRepeater {
          summaryText
          teamlist {
            info
            name
            jobTitle
            image {
              node {
                sourceUrl
                uri
                altText
                title
                id
              }
            }
          }
        }
      }
    }
  }
}`;

export { GetMeetTheTeamQuery };
