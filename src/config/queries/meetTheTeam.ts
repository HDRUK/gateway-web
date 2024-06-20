const GetMeetTheTeamQuery = `
query GetMeetTheTeam {
  posts(where: {name: "meet-the-team"}) {
    edges {
      node {
        title
        id
        meetTheTeamRepeater {
          summaryText
          teamList {
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
