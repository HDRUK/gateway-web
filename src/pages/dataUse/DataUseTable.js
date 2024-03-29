import moment from 'moment';
import { Link } from 'react-router-dom';
import { Table, Dropdown } from 'react-bootstrap';

import googleAnalytics from '../../tracking';

const DataUseTable = ({ teamType, data, active, pending, archived, onClickArchive, onClickUnarchive, onClickApprove, onClickReject }) => {
    const handleAnalytics = (label, value) => {
        googleAnalytics.recordEvent('Data uses', label, value);
    };

    const handleClickDataset = pid => {
        handleAnalytics('Clicked on dataset to open', pid);
    };

    const handleClickDatause = id => {
        handleAnalytics('Clicked on data use to open', id);
    };

    const handleClickApprove = id => {
        handleAnalytics('Clicked approve data use', id);

        onClickApprove(id);
    };

    const handleClickReject = id => {
        handleAnalytics('Clicked reject data use', id);

        onClickReject(id);
    };

    const handleClickArchive = id => {
        handleAnalytics('Clicked archived data use', id);

        onClickArchive(id);
    };

    const handleClickUnarchive = id => {
        handleAnalytics('Clicked unarchive data use', id);

        onClickUnarchive(id);
    };

    const renderGatewayDatasets = dataUse => {
        const datasets = dataUse.gatewayDatasetsInfo.map(gatewayDataset => (
            <div key={gatewayDataset.pid}>
                <Link
                    className='data-use-link'
                    to={`/dataset/${gatewayDataset.pid}`}
                    target='_blank'
                    onClick={() => handleClickDataset(gatewayDataset.pid)}>
                    {gatewayDataset.name}
                </Link>
            </div>
        ));

        return datasets;
    };

    const renderNonGatewayDatasets = dataUse => {
        const datasets = dataUse.nonGatewayDatasets.map(nonGatewayDataset => (
            <div key={nonGatewayDataset} className='data-use-namedDataset'>
                {nonGatewayDataset}
            </div>
        ));

        return datasets;
    };

    return (
        <Table className='data-use-table black-14'>
            <thead>
                <tr>
                    <th>Last activity</th>
                    <th>Project Title</th>
                    <th>Dataset(s)</th>
                    {(active || pending || archived) && <th />}
                </tr>
            </thead>
            <tbody>
                {data.map(dataUse => (
                    <tr key={dataUse.id}>
                        <td>{moment(dataUse.lastActivity).format('DD/MM/YYYY')}</td>
                        <td>
                            <Link
                                className='data-use-link'
                                to={`/datause/${dataUse.id}`}
                                target='_blank'
                                onClick={() => handleClickDatause(dataUse.id)}>
                                {dataUse.projectTitle}
                            </Link>
                            <p>{dataUse.organisationName}</p>
                        </td>
                        <td>
                            {renderGatewayDatasets(dataUse)} {renderNonGatewayDatasets(dataUse)}
                        </td>
                        {(active || pending || archived) && (
                            <td style={{ width: '130px' }}>
                                {active && (
                                    <Dropdown>
                                        <Dropdown.Toggle variant='outline-secondary' className='data-use-action'>
                                            Actions
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href={`/datauseRegister/edit/${dataUse.id}`}>Edit</Dropdown.Item>
                                            {teamType !== 'user' && (
                                                <Dropdown.Item onClick={() => handleClickArchive(dataUse.id)}>Archive</Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                                {pending && teamType === 'admin' && (
                                    <Dropdown>
                                        <Dropdown.Toggle variant='outline-secondary' className='data-use-action'>
                                            Actions
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleClickApprove(dataUse.id)}>Approve</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleClickReject(dataUse.id)}>Reject</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                                {archived && (
                                    <Dropdown>
                                        <Dropdown.Toggle variant='outline-secondary' className='data-use-action'>
                                            Actions
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleClickUnarchive(dataUse.id)}>Unarchive</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default DataUseTable;
