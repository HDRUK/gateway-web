"use client";

import { useState } from "react";
import { Library, SelectedLibrary } from "@/interfaces/Library";
import Box from "@/components/Box";
import Loading from "@/components/Loading";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import metaData, { noFollowRobots } from "@/utils/metdata";
import Header from "./Header";
import LibraryTable from "./LibraryTable";
import RightPanel from "./RightPanel";

export const metadata = metaData(
    {
        title: "Library",
        description: "",
    },
    noFollowRobots
);

const UserLibrary = () => {
    const { data, isLoading, mutate } = useGet<Library[]>(apis.librariesV1Url);
    const [selected, setSelected] = useState<SelectedLibrary>({});

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        itemName: "Library item",
    });

    const handleSelect = (data: SelectedLibrary) => {
        setSelected({ ...selected, ...data });
    };

    const handleRemove = (id: string) => {
        deleteLibrary(id).then(() => {
            mutate();
            setSelected({});
        });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "3fr 1fr",
                    gap: 2,
                }}>
                <Box sx={{ p: 0, m: 0 }}>
                    <LibraryTable
                        data={data}
                        selected={selected}
                        handleSelect={handleSelect}
                        handleRemove={handleRemove}
                    />
                </Box>
                <Box sx={{ p: 0, m: 0 }}>
                    <RightPanel
                        selected={selected}
                        handleRemove={handleRemove}
                    />
                </Box>
            </Box>
        </>
    );
};

export default UserLibrary;
