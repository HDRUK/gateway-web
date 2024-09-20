import { ContentPageQueryOptions } from "@/interfaces/Cms";

const GetContentPageQuery = (
    queryName: string,
    { id, idType = "URI" }: ContentPageQueryOptions
) => {
    return `
      query ${queryName} {
        page(id: "${id}", idType: ${idType} ) {
          title
          content
          categories {
            nodes {
              name
            }
          }
        }
      }
    `;
};

export { GetContentPageQuery };
