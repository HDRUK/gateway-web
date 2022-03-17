import React, { Fragment } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import DataUtilityModalInfo from './DataUtilityModalInfo';
import '../Dataset.scss';

class DataUtilityModal extends React.Component {
    state = {
        allOpen: false,
    };

    updateAllOpen = allOpen => {
        if (allOpen === false) {
            this.setState({ allOpen: true });
        } else if (allOpen === true) {
            this.setState({ allOpen: false });
        }
    };

    render() {
        const { allOpen } = this.state;

        return (
            <Fragment>
                <Row className='expandAllBox'>
                    <span className='purple-14 pointer' id='expandAllModal' onClick={() => this.updateAllOpen(allOpen)}>
                        {allOpen ? 'Hide all' : 'Expand all'}
                    </span>
                </Row>
                <div className='dataUtilityModalBackground'>
                    <Container>
                        <Row>
                            <Col sm={12} lg={12} className='mt-2 mb-3'>
                                <DataUtilityModalInfo section={'Documentation'} open={allOpen} />

                                <DataUtilityModalInfo section={'TechQuality'} open={allOpen} />

                                <DataUtilityModalInfo section={'Access'} open={allOpen} />

                                <DataUtilityModalInfo section={'Value'} open={allOpen} />

                                <DataUtilityModalInfo section={'Coverage'} open={allOpen} />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Fragment>
        );
    }
}

export default DataUtilityModal;
