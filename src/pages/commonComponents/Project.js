import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SVGIcon from "../../images/SVGIcon"
import Loading from './Loading'
import ReactMarkdown from 'react-markdown';

import { axiosIG } from '../../utils/axios.util';

class Project extends React.Component {
    // initialize our state
    state = {
        data: [],
        isLoading: true,
        activeLink: true
    };

    constructor(props) {
        super(props)
        this.state.activeLink = props.activeLink;
        if (props.data) {
            this.state.data = props.data;
            this.state.isLoading = false;
        }
        else if (props.id) {
            this.state.id = props.id;
            this.getDataSearchFromDb()
        }
    }

    getDataSearchFromDb = () => {
        //need to handle error if no id is found
        this.setState({ isLoading: true });
        axiosIG.get('/api/v1/project/' + this.state.id)
            .then((res) => {
                this.setState({
                    data: res.data.data[0],
                    isLoading: false
                });
            })
    };

    render() {
        const { data, isLoading, activeLink } = this.state;
 
        if (typeof data.datasetids === 'undefined') {
            data.datasetids = [];
        }

        if (typeof data.toolids === 'undefined') {
            data.toolids = [];
        }

        if (isLoading) {
            return <Loading />;
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var updatedDate = new Date(data.updatedon);
        var updatedOnDate = monthNames[updatedDate.getMonth()] + " " + updatedDate.getFullYear();

        return (
            <Row className="mt-2"> 
                <Col>
                <div className={this.props.tempRelatedObjectIds && this.props.tempRelatedObjectIds.some(object => object.objectId === data.id) ? "rectangle selectedBorder" : "rectangle"} onClick={() => !activeLink && this.props.doAddToTempRelatedObjects(data.id, data.type) } >   
                        <Row>
                            <Col xs={2} lg={1} className="iconHolder">
                                <SVGIcon name="projecticon" width={20} height={24} fill={'#3db28c'} />
                            </Col>
                            <Col xs={10} lg={8}>
                                <p> 
                                    {activeLink===true ? 
                                    <span ><a className="black-16" style={{ cursor: 'pointer' }} href={'/project/' + data.id} >{data.name.substr(0, 75) + (data.name.length > 75 ? '...' : '')}</a></span>
                                    : <span className="black-16" >{data.name.substr(0, 75) + (data.name.length > 75 ? '...' : '')}</span> }
                                    <br />
                                    <br />
                                    <span className="gray800-14">
                                        {data.persons <= 0 ? 'Author not listed' : data.persons.map((person, index) => {
                                            if (index > 0 ) {
                                                if (activeLink===true){
                                                    return <span><span className="reviewTitleGap gray800-14">·</span><a className="gray800-14" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a></span>
                                                }
                                                else {
                                                    return <span className="gray800-14"><span className="reviewTitleGap gray800-14">·</span>{person.firstname} {person.lastname}</span> 
                                                }
                                            }
                                            else {
                                                if (activeLink===true){
                                                    return <span><a className="gray800-14" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a></span>
                                                }
                                                else {
                                                    return <span className="gray800-14">{person.firstname} {person.lastname}</span> 
                                                }
                                            }
                                        })}
                                    </span>
                                </p>
                            </Col>
                            <Col xs={{ span: 12, order: 2 }} lg={{ span: 3, order: 1 }} className="dateHolder mt-2">
                                <span className="gray700-13 pr-1">
                                    Updated
                                    </span>
                                <span className="gray700-13 pr-1">
                                    {updatedOnDate}
                                </span>
                            </Col>

                            <Col xs={{ span: 2, order: 0 }} lg={{ span: 1, order: 2 }}></Col>
                            <Col xs={{ span: 10, order: 0 }} lg={{ span: 11, order: 2 }} >
                                <p className="gray800-14">
                                    {!data.toolids.length ? '' :
                                        <span className="mr-1">
                                            <b>
                                                {!data.toolids.length ? '' : data.toolids.length}
                                                {data.toolids.length === 1 ? " tool" : " tools"}
                                            </b>
                                        </span>
                                    }

                                    {!data.datasetids.length ? '' :
                                        <span className="mr-1">
                                            {data.toolids.length ? ', ' : ''}
                                            <b>
                                                {!data.datasetids.length ? '' : data.datasetids.length}
                                                {data.datasetids.length === 1 ? " data set" : " data sets"}
                                            </b>
                                        </span>
                                    }
                                    
                                    <ReactMarkdown source={data.description.substr(0, 160) + (data.description.length > 160 ? '...' : '')} />
                    
                                </p>
                            </Col>

                            <Col xs={{ span: 12, order: 1 }} lg={{ span: 12, order: 3 }}>
                                {!data.categories.category ? '' : activeLink === true ? <a href={'/search?search=' + data.categories.category}><div className="mr-2 gray800-14 tagBadges mb-2 mt-2">{data.categories.category}</div></a> : <div className="mr-2 gray800-14 tagBadges mb-2 mt-2">{data.categories.category}</div>}

                                {!data.tags.features || data.tags.features.length <= 0 ? '' : data.tags.features.map((feature) => {
                                    if (activeLink===true){
                                        return <a href={'/search?search=' + feature}><div className="mr-2 gray800-14 tagBadges mb-2 mt-2">{feature}</div></a>
                                    }
                                    else {
                                        return <div className="mr-2 gray800-14 tagBadges mb-2 mt-2">{feature}</div>
                                    }
                                })}

                                {!data.tags.topics || data.tags.topics.length <= 0 ? '' : data.tags.topics.map((topic) => {
                                    if (activeLink===true){
                                        return <a href={'/search?search=' + topic}><div className="mr-2 gray800-14 tagBadges mb-2 mt-2">{topic}</div></a>
                                    }
                                    else {
                                        return <div className="mr-2 gray800-14 tagBadges mb-2 mt-2">{topic}</div>
                                    }
                                })}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Project;
