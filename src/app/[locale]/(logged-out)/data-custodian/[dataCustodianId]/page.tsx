import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getTeam } from "@/utils/api";
// import ActionBar from "./components/ActionBar";
// import DataUseContent from "./components/DataUseContent";
import { dataCustodianFields } from "./config";

const TRANSLATION_PATH = "pages.dataCustodian";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Custodian",
    description: "",
};

export default async function DataCustodianItemPage({
    params,
}: {
    params: { dataCustodianId: string };
}) {
    console.log('start');
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataCustodianId } = params;
    const cookieStore = cookies();
    console.log('get data');
    const data = await getTeam(cookieStore, dataCustodianId);
    console.log('got data', data);
    const populatedSections = dataCustodianFields.filter(section =>
        section.fields.some(field => !isEmpty(get(data, field.path)))
    );

    const activeLinkList = populatedSections.map(section => {
        return {
            label: t(section.sectionName),
        };
    });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    {/* <ActionBar /> */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        <Typography
                            variant="h2"
                            sx={{ pt: 0.5, pb: 0.5, m: 0 }}>
                            {data.name}
                        </Typography>
                        {/* <DataCustodianContent
                            data={data}
                            populatedSections={populatedSections}
                        /> */}
                    </Box>
                </>
            }
        />
        
    );
}
