import React from 'react';
import UnmetDemand from '../../../DARComponents/UnmetDemand';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import featureEnabled from '../../../../../utils/featureSwitches/unmetDemands';

const UnmetDemandSection = ({ handleSelect, key, data, renderNoResults }) => {
    return (
        <>
            {featureEnabled() ? (
                <>
                    <Row className='accountHeader margin-top-16'>
                        <Col sm={12} lg={12}>
                            <Row>
                                <Col sm={12} lg={12}>
                                    <span className='black-20'>Unmet demand</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} lg={12}>
                                    <span className='gray700-13'>
                                        For each resource type, which searches yielded no results, ordered by highest number of repeat
                                        searches
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className='tabsBackground'>
                        <Col sm={12} lg={12}>
                            <Tabs className='dataAccessTabs gray700-13' data-test-id='unmet-tabs' activeKey={key} onSelect={handleSelect}>
                                <Tab eventKey='Datasets' title={'Datasets'}></Tab>
                                <Tab eventKey='Tools' title={'Tools'}></Tab>
                                <Tab eventKey='Projects' title={'Projects'}></Tab>
                                <Tab eventKey='Papers' title={'Papers'}></Tab>
                                <Tab eventKey='People' title={'People'}></Tab>
                            </Tabs>
                        </Col>
                    </Row>

                    {data.length === 0
                        ? renderNoResults("There isn't enough data available for this month yet")
                        : (() => {
                              switch (key) {
                                  case 'Datasets':
                                      return (
                                          <div>
                                              <Row>
                                                  <Col sm={12} lg={12}>
                                                      <Row className='subHeader mt-3 gray800-14-bold'>
                                                          <Col sm={8} lg={8}>
                                                              Search term{' '}
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Searches
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Dataset results
                                                          </Col>
                                                      </Row>
                                                      {data.map((dat, i) => {
                                                          return <UnmetDemand key={i} data={dat} />;
                                                      })}
                                                  </Col>
                                              </Row>
                                          </div>
                                      );
                                  case 'Tools':
                                      return (
                                          <div>
                                              <Row>
                                                  <Col sm={12} lg={12}>
                                                      <Row className='subHeader mt-3 gray800-14-bold'>
                                                          <Col sm={8} lg={8}>
                                                              Search term{' '}
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Searches
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Tool results
                                                          </Col>
                                                      </Row>
                                                      {data.map(dat => {
                                                          return <UnmetDemand data={dat} />;
                                                      })}
                                                  </Col>
                                              </Row>
                                          </div>
                                      );
                                  case 'Projects':
                                      return (
                                          <div>
                                              <Row>
                                                  <Col sm={12} lg={12}>
                                                      <Row className='subHeader mt-3 gray800-14-bold'>
                                                          <Col sm={8} lg={8}>
                                                              Search term{' '}
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Searches
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Project results
                                                          </Col>
                                                      </Row>
                                                      {data.map(dat => {
                                                          return <UnmetDemand data={dat} />;
                                                      })}
                                                  </Col>
                                              </Row>
                                          </div>
                                      );
                                  case 'Papers':
                                      return (
                                          <div>
                                              <Row>
                                                  <Col sm={12} lg={12}>
                                                      <Row className='subHeader mt-3 gray800-14-bold'>
                                                          <Col sm={8} lg={8}>
                                                              Search term{' '}
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Searches
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Paper results
                                                          </Col>
                                                      </Row>
                                                      {data.map(dat => {
                                                          return <UnmetDemand data={dat} />;
                                                      })}
                                                  </Col>
                                              </Row>
                                          </div>
                                      );
                                  case 'People':
                                      return (
                                          <div>
                                              <Row>
                                                  <Col sm={12} lg={12}>
                                                      <Row className='subHeader mt-3 gray800-14-bold'>
                                                          <Col sm={8} lg={8}>
                                                              Search term{' '}
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              Searches
                                                          </Col>
                                                          <Col sm={2} lg={2}>
                                                              People results
                                                          </Col>
                                                      </Row>
                                                      {data.map(dat => {
                                                          return <UnmetDemand data={dat} />;
                                                      })}
                                                  </Col>
                                              </Row>
                                          </div>
                                      );
                              }
                          })()}
                </>
            ) : null}
        </>
    );
};

export default UnmetDemandSection;
