const GetMissionAndPurposesQuery = `
  query GetMissionAndPurposes {
    posts(where:{categoryName: "missionAndPurpose", orderby: {field: DATE, order: ASC}}) {
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

export { GetMissionAndPurposesQuery };
