import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SVGIcon from "../../images/SVGIcon";
import axios from 'axios';
import Loading from './Loading'
import ReactMarkdown from 'react-markdown';

var baseURL = require('./BaseURL').getURL();

class Tool extends React.Component {

    // initialize our state
    state = {
        data: [],
        reviewData: [],
        isLoading: true
    };

    constructor(props) {
        super(props)
        if (props.data) {
            this.state.data = props.data;
            this.state.reviewData = this.state.data.reviews;
            this.state.isLoading = false;
        }
        else if (props.id) {
            this.state.id = props.id;
            this.getDataSearchFromDb();
        }
    }

    getDataSearchFromDb = () => {
        //need to handle error if no id is found
        this.setState({ isLoading: true });
        axios.get(baseURL + '/api/v1/tools/' + this.state.id)
            .then((res) => {
                this.setState({
                    data: res.data.data[0],
                    reviewData: res.data.reviewData,
                    isLoading: false
                });
            })
    };

    render() {
        const { data, isLoading, reviewData } = this.state;

        if (isLoading) {
            return <Loading />;
        }

        var ratingsTotal = 0;
        if (reviewData && reviewData.length > 0) {
            reviewData.forEach(review => {
                ratingsTotal = ratingsTotal + review.rating;
            });
        }

        const ratingsCount = (!!reviewData ? reviewData.length : 0);
        const avgRating = (!!reviewData && reviewData.length > 0) ? (ratingsTotal / ratingsCount) : '';

        if (typeof data.datasetids === 'undefined') {
            data.datasetids = [];
        }

        if (typeof data.projectids === 'undefined') {
            data.projectids = [];
        }

        if (typeof data.authors === 'undefined') {
            data.authors = [];
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var updatedDate = new Date(data.updatedon);
        var updatedOnDate = monthNames[updatedDate.getMonth()] + " " + updatedDate.getFullYear();

        return (
            <Row className="mt-2">
                <Col>
                    <div className="Rectangle">
                        <Row>
                            <Col xs={2} lg={1} className="iconHolder">
                                <SVGIcon name="toolicon" width={18} height={18} fill={'#3db28c'} />
                            </Col>
                            <Col xs={10} lg={8}>
                                <p>
                                    <span > <a className="searchHolder Black-16px" href={'/tool/' + data.id} >{data.name.substr(0, 75) + (data.name.length > 75 ? '...' : '')}</a></span>
                                    <br />
                                    <span className="Gray500-13px">
                                        <span className="Gray500-13px">
                                            {!!ratingsTotal && ratingsCount === 1 ? ratingsCount + ' review' : ratingsCount + ' reviews'}
                                            <span className="reviewTitleGap">·</span>
                                            {avgRating === 0 ? 'No average rating' : (Math.round(avgRating * 10) / 10) + ' average rating'}
                                        </span>
                                    </span>
                                    <br />
                                    <br />
                                    <span className="Gray800-14px">
                                        {data.persons <= 0 ? 'Author not listed' : data.persons.map((person, index) => {
                                            if (index > 0) {
                                                return <span><span className="reviewTitleGap">·</span><a className="Gray800-14px" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a></span>
                                            }
                                            else {
                                                return <span><a className="Gray800-14px" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a></span>
                                            }
                                        })}
                                    </span>
                                </p>
                            </Col>
                            <Col xs={{ span: 12, order: 3 }} lg={{ span: 3, order: 1 }} className="dateHolder mt-2">
                                <span className="Gray700-13px pr-1">
                                    Updated
                                    </span>
                                <span className="Gray700-13px pr-1">
                                    {updatedOnDate}
                                </span>
                            </Col>

                            <Col xs={{ span: 2, order: 0 }} lg={{ span: 1, order: 2 }}></Col>
                            <Col xs={{ span: 10, order: 0 }} lg={{ span: 11, order: 2 }} >
                                <p className="Gray800-14px">

                                    {data.projectids && data.projectids.length ? 
                                        <span className="mr-1">
                                            <b>
                                                {!data.projectids.length ? '' : data.projectids.length}
                                                {data.projectids.length === 1 ? " project" : " projects"}
                                            </b>
                                        </span>
                                    : ""
                                    }


                                    {data.datasetids && data.datasetids.length ?
                                        <span className="mr-1">
                                            {data.projectids.length ? ', ' : ''}
                                            <b>
                                                {!data.datasetids.length ? '' : data.datasetids.length}
                                                {data.datasetids.length === 1 ? " data set" : " data sets"}
                                            </b>
                                        </span>
                                    : ""
                                    }

                                    {data.projectids && data.projectids.length || data.datasetids && data.datasetids.length ?
                                        <span className="reviewTitleGap">·</span>
                                        : ''
                                    }
                                   
                                    <ReactMarkdown source={data.description.substr(0, 160) + (data.description.length > 160 ? '...' : '')} />
                                   
                                    {/* {data.description.substr(0, 160) + (data.description.length > 160 ? '...' : '')} */}
                                </p>
                            </Col>

                            <Col xs={{ span: 12, order: 1 }} lg={{ span: 12, order: 3 }}>
                                {!data.categories.category ? '' : <a href={'/search?search=' + data.categories.category + '&type=all'}><div className="mr-2 Gray800-14px tagBadges mb-2 mt-2">{data.categories.category}</div></a>}

                                {!data.categories.programmingLanguage || data.categories.programmingLanguage.length <= 0 ? '' : data.categories.programmingLanguage.map((language) => {
                                    return <a href={'/search?search=' + language + '&type=all'}><div className="mr-2 Gray800-14px tagBadges mb-2 mt-2">{language}</div></a>
                                })}

                                {!data.tags.features || data.tags.features.length <= 0 ? '' : data.tags.features.map((feature) => {
                                    return <a href={'/search?search=' + feature + '&type=all'}><div className="mr-2 Gray800-14px tagBadges mb-2 mt-2">{feature}</div></a>
                                })}

                                {!data.tags.topics || data.tags.topics.length <= 0 ? '' : data.tags.topics.map((topic) => {
                                    return <a href={'/search?search=' + topic + '&type=all'}><div className="mr-2 Gray800-14px tagBadges mb-2 mt-2">{topic}</div></a>
                                })}

                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Tool;