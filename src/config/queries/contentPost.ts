import { ContentPageQueryOptions } from "@/interfaces/Cms";

const GetContentPostQuery = (
    queryName: string,
    { id, idType = "URI" }: ContentPageQueryOptions
) => {
    return `
      query ${queryName} {
        post(id: "${id}", idType: ${idType} ) {
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

export { GetContentPostQuery };
