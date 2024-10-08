import {
    ContentPageQueryOptions,
    ContentPageByParentQueryOptions,
} from "@/interfaces/Cms";

const GetContentPageQuery = (
    queryName: string,
    { id, idType = "URI" }: ContentPageQueryOptions,
    otherFields?: string
) => {
    return `
      query ${queryName} {
        page(id: "${id}", idType: ${idType} ) {
          title
          content
          ${otherFields ?? ""}
        }
      }
    `;
};

const GetContentPagesByNameQuery = (
    queryName: string,
    { name }: ContentPageQueryOptions
) => {
    return `
    query ${queryName} {
      pages(where: { name: "${name}" }) {
        nodes {
          title
          content
        }
      }
    }
  `;
};

const GetContentPageByParentQuery = (
    queryName: string,
    { parentId }: ContentPageByParentQueryOptions
) => {
    return `
      query ${queryName} {
        page(where: {id: "${parentId}", idType: URI }) {
          nodes {
            content
            title
            slug
          }
        }
      }
    `;
};

export {
    GetContentPageQuery,
    GetContentPageByParentQuery,
    GetContentPagesByNameQuery,
};
