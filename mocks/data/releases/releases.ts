import { ReleaseNode } from "@/interfaces/Releases";

const mockedReleaseNode = (date: string, id: string): ReleaseNode => ({
    node: {
        id,
        title: `Release ${id}`,
        date,
        content: `Release ${id}`,
    },
});

export { mockedReleaseNode };
