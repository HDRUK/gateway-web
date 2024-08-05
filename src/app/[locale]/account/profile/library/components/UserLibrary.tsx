"use client";

import { useState } from "react";
import { Library } from "@/interfaces/Library";
import Box from "@/components/Box";
import Loading from "@/components/Loading";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import Header from "./Header";
import LibraryTable from "./LibraryTable";
import RightPanel from "./RightPanel";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Library",
    description: "",
};

interface SelectionData {
    [id: string]: boolean;
}

const UserLibrary = () => {
    const { data, isLoading, mutate } = useGet<Library[]>(apis.librariesV1Url);
    const [selected, setSelected] = useState<SelectionData>({});

    const deleteLibrary = useDelete(apis.librariesV1Url, {
        itemName: "Library",
    });

    const handleSelect = (data: SelectionData) => {
        setSelected({ ...selected, ...data });
    };

    const handleRemove = (id: number) => {
        deleteLibrary(id).then(() => mutate());
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
                    <RightPanel selected={selected} />
                </Box>
            </Box>
        </>
    );
};

export default UserLibrary;
