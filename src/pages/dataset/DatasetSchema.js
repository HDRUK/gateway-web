import  React from "react";
import MetaTags from 'react-meta-tags';
import { JsonLd } from "react-schemaorg";

export default class DatasetSchema extends React.Component {
    render() {
        return (
        <MetaTags>
            <JsonLd
                item={this.props.datasetSchema}
            />
        </MetaTags>
        )
    }
}