import React, { Fragment, useState, useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { ReactComponent as ArrowDownSvg } from '../../../images/stock.svg';
import { SlideDown } from 'react-slidedown';
import './TeamHelp.scss';
import Loading from '../../commonComponents/Loading';
import { baseURL } from '../../../configs/url.config';
import axios from 'axios';

const TeamHelp = () => {
    useEffect(() => {
        getTeamHelp();
    }, []);

    const [help, setHelp] = useState([]);

    const [isLoading, setLoading] = useState(false);

    const getTeamHelp = async () => {
        try {
            setLoading(true);
            let response = await axios.get(`${baseURL}/api/v1/help/team`);
            let helpFAQ = response.data.help.map(r => ({ ...r, closed: true }));
            setHelp(helpFAQ);
            setLoading(false);
        } catch (err) {
            console.error(`Error fetching team help ${err.message}`);
        }
    };

    const toggleHelp = index => {
        let helpArr = [...help].map((h, i) => {
            return {
                ...h,
                closed: i === index ? !h.closed : h.closed,
            };
        });
        setHelp(helpArr);
    };

    if (isLoading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    return (
        <Fragment>
            <Row>
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <div className='teamRectangle'>
                        <h1 className=' mb-2'>Frequently asked questions</h1>
                        <p className='gray800-15 mb-8 teamSubtitle'>
                            This section provides answers to some of the questions that you may have about workflows, team members and data
                            access request applications.
                        </p>
                        {help.length > 0 &&
                            help.map((h, i) => {
                                return (
                                    <Fragment>
                                        <div className='mainTeamCard' onClick={e => toggleHelp(i)}>
                                            <Row className='ml-0 teamQuestion'>
                                                <ArrowDownSvg className={h.closed ? 'margin-top-6' : 'flip180 margin-top-6'} />
                                                <div className='gray800-14 margin-left-16'>{h.question}</div>
                                            </Row>
                                        </div>
                                        <SlideDown closed={h.closed} className='teamSlide'>
                                            <div className='body teamAnswer'>
                                                <div className='gray800-14'>{h.answer}</div>
                                            </div>
                                        </SlideDown>
                                    </Fragment>
                                );
                            })}
                    </div>
                </Col>
                <Col sm={1} lg={1} />
            </Row>
        </Fragment>
    );
};

export default TeamHelp;
