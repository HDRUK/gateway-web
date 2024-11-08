import { Helmet } from 'react-helmet';
import { JsonLd } from 'react-schemaorg';

const DatasetSchema = ({ data }) => {
    const renderSchema = () => {
        return {
            '@context': 'http://schema.org/',
            '@type': 'Dataset',
            identifier: data.pid,
            url: `https://web.old.healthdatagateway.org/dataset/${data.pid}`,
            name: data.datasetv2.summary.title,
            description: data.datasetv2.summary.abstract,
            keywords: data.datasetv2.summary.keywords,
            includedinDataCatalog: [
                {
                    '@type': 'DataCatalog',
                    name: `${data.datasetv2.summary.publisher.memberOf} > ${data.datasetv2.summary.publisher.name}`,
                    url: data.datasetv2.summary.contactPoint,
                },
                {
                    '@type': 'DataCatalog',
                    name: 'HDR UK Health Data Gateway',
                    url: 'http://healthdatagateway.org',
                },
            ],
        };
    };

    return (
        <Helmet>
            <JsonLd item={renderSchema()} />
        </Helmet>
    );
};

export default DatasetSchema;
