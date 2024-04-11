export const metadata = {
    title: "Health Data Research Innovation Gateway - Dataset",
    description: "",
};

// const DATASET_STAT_PATHS = [
//     "metadata.metadata.summary.populationSize",
//     "metadata.metadata.provenance.temporal.startDate",
//     "metadata.metadata.provenance.temporal.endDate",
//     "metadata.metadata.coverage.biologicalsamples",
//     "metadata.metadata.coverage.spatial",
//     "metadata.metadata.accessibility.access.deliveryLeadTime",
// ];

export default async function DatasetItemPage({
    params,
}: {
    params: { datasetId: string };
}) {
    const { datasetId } = params;

    // const cookieStore = cookies();
    // const data = await getDataset(cookieStore, datasetId);

    console.log("datasetId - ", datasetId);

    // const datasetVersion = data?.versions?.[0];
    // console.log("datasetVersion - ", datasetVersion);

    // const datasetStats = pick(datasetVersion, DATASET_STAT_PATHS);
    // console.log("datasetStats - ", datasetStats);

    // const populatedSections = datasetFields.filter(section =>
    //     section.fields.some(field => !isEmpty(get(datasetVersion, field.path)))
    // );
    // console.log("populatedSections - ", populatedSections);

    // const activeLinkList = populatedSections.map(section => {
    //     return { label: section.sectionName };
    // });

    return <p>TEST</p>;
}
