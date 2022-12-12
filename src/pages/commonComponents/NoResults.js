import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class NoResults extends React.Component {
    state = {
        dataUtilityWizard: false,
    };

    render() {
        const { dataUtilityWizard } = this.state;
        const { searchString, type } = this.props;

        return (
            <div>
                {dataUtilityWizard ? (
                    <Row className='mt-4'>
                        <Col className='gray800-14 text-center'>
                            <p>We couldn’t find any datasets matching your filters chosen via the data utility wizard</p>
                            <p>Try different data utility filters here to see examples of datasets</p>
                        </Col>
                    </Row>
                ) : (
                    <>
                        <Row className='mt-4'>
                            <Col className='gray800-14 text-center'>
                                <span>
                                    {' '}
                                    We couldn’t find any {type} matching the search term ‘{searchString}’{' '}
                                </span>
                            </Col>
                        </Row>

                        {(() => {
                            if (type === 'datasets') {
                                return (
                                    <Row className='mt-3'>
                                        <Col className='gray800-14 text-center'>
                                            <span>
                                                {' '}
                                                Try searching for ‘
                                                <a href={'/search?search=' + 'COVID-19'} className='purple-14'>
                                                    COVID-19
                                                </a>
                                                ’ if you want to see examples of datasets{' '}
                                            </span>
                                        </Col>
                                    </Row>
                                );
                            } else if (type === 'tools') {
                                return (
                                    <>
                                        <Row className='mt-3'>
                                            <Col className='gray800-14 text-center'>
                                                <span>
                                                    {' '}
                                                    Tools may be repositories, software, guidelines, courses or any useful resources that
                                                    can be used in research or analysis.{' '}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col className='gray800-14 text-center'>
                                                <span>
                                                    {' '}
                                                    Try searching for ‘
                                                    <a href={'/search?search=' + 'COVID-19'} className='purple-14'>
                                                        COVID-19
                                                    </a>
                                                    ’ if you want to see examples of tools{' '}
                                                </span>
                                            </Col>
                                        </Row>
                                    </>
                                );
                            } else if (type === 'papers' || type === 'collections') {
                                return (
                                    <>
                                        <Row className='mt-3'>
                                            <Col className='gray800-14 text-center'>
                                                <span>
                                                    {' '}
                                                    Try searching for ‘
                                                    <a href={'/search?search=' + 'COVID-19'} className='purple-14'>
                                                        COVID-19
                                                    </a>
                                                    ’ if you want to see examples of {type}{' '}
                                                </span>
                                            </Col>
                                        </Row>
                                    </>
                                );
                            } else if (type === 'profiles') {
                                return <></>;
                            }
                        })()}
                    </>
                )}
            </div>
        );
    }
}

export default NoResults;
