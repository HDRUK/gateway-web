import React from 'react';
import moment from 'moment';
import { Row, Col, Button } from 'react-bootstrap';
import Loading from './Loading'
import { ReactComponent as PersonPlaceholderSvg } from '../../images/person-placeholder.svg';
import SVGIcon from "../../images/SVGIcon"

import { axiosIG } from '../../utils/axios.util';

class RelatedObject extends React.Component {
    
    state = {
        relatedObject: [],
        reason: '',
        // user: '',
        // updated: '' ,
        data: [],
        activeLink: true,
        isLoading: true,
        didDelete: false,
        inCollection: false
    };

    constructor(props) {
        super(props)
        this.state.activeLink = props.activeLink;
        if(props.didDelete){
            this.state.didDelete = props.didDelete;
        }
        if(props.inCollection){
            this.state.inCollection = props.inCollection;
        }
        if (props.data) {
            this.state.data = props.data;
            //this.state.reviewData = this.state.data.reviews;
            this.state.isLoading = false;
        }
        else if (props.objectId) {
            this.state.relatedObject = props.relatedObject;
            this.state.reason = props.reason;
            // this.state.user = props.userState[0].name;
            // this.state.updated = moment().format("DD MMM YYYY");
            this.getRelatedObjectFromDb(props.objectId);
        }
        else {
            this.state.relatedObject = props.relatedObject;
            this.getRelatedObjectFromDb(this.state.relatedObject.objectId); 
        }
    }

    removeCard = (id, reason) => {
        this.setState({
             reason: reason
        });
    
        this.getRelatedObjectFromDb(id);
    }


    getRelatedObjectFromDb = (id) => {
        //need to handle error if no id is found
        this.setState({ isLoading: true });
        axiosIG.get('/api/v1/relatedobject/' + id)
            .then((res) => {
                this.setState({
                    data: res.data.data[0],
                    isLoading: false
                });
            })
    };

    removeButton = () => {
        this.props.doRemoveObject(this.state.data.id, this.state.data.type) 
    }

    handleChange = (id, reason, type) => {
        this.setState({reason: reason})
        this.props.doUpdateReason(id, reason, type)
    }

 
    render() {
        const { data, isLoading, activeLink, relatedObject, inCollection } = this.state; 

        if (isLoading) {
            return <Loading />;
        }

        if(this.props.didDelete){
            this.props.updateDeleteFlag()
            this.removeCard(this.props.objectId, this.props.reason)
        }
        

        var rectangleClassName = 'rectangle';
        if (this.props.tempRelatedObjectIds && this.props.tempRelatedObjectIds.some(object => object.objectId === data.id)) {
            rectangleClassName = 'rectangle selectedBorder';
        }
        else if (this.props.showRelationshipQuestion) {
            rectangleClassName= 'rectangleWithBorder';
        }

        return (
            <Row className="mt-2"> 
                <Col>
                    <div className={rectangleClassName} onClick={() => !activeLink && !this.props.showRelationshipQuestion && !this.props.showRelationshipAnswer && this.props.doAddToTempRelatedObjects(data.id, data.type===undefined ? "dataset" : data.type) } >
                       
                        {(() => {
                            if (data.type === 'tool') {
                                return(
                                    <Row>
                                        <Col sm={10} lg={10}>
                                            {activeLink===true ?
                                            <a className="black-bold-16" style={{ cursor: 'pointer' }} href={'/tool/' + data.id} >{data.name}</a>
                                            : <span className="black-bold-16"> {data.name}</span> }
                                            <br />
                                            {!data.persons || data.persons <= 0 ? <span className="gray800-14">Author not listed</span> : data.persons.map((person, index) => {
                                                if (index > 0) {
                                                    if (activeLink===true){
                                                        return <><span className="reviewTitleGap gray800-14">·</span><a className="gray800-14" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a></>
                                                    }
                                                    else {
                                                        return <span className="gray800-14">, {person.firstname} {person.lastname}</span>
                                                    }
                                                }
                                                else {
                                                    if (activeLink===true){
                                                        return <a className="gray800-14" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a>
                                                    }
                                                    else {
                                                        return <span className="gray800-14">{person.firstname} {person.lastname}</span>
                                                    }
                                                }
                                            })}
                                        </Col> 
                                        <Col sm={2} lg={2}>
                                            {this.props.showRelationshipAnswer && relatedObject.updated || this.props.collectionUpdated ? <span className="gray700-13 mr-2 floatRight">{relatedObject.updated ? 'Updated ' + relatedObject.updated.substring(3) : 'Updated ' + this.props.collectionUpdated.substring(3)}</span> : ''}
                                            {this.props.showRelationshipQuestion ? <Button variant="medium" className="soft-black-14" onClick={this.removeButton} ><SVGIcon name="closeicon" fill={'#979797'} className="buttonSvg mr-2" />Remove</Button> : ''}
                                        </Col>
                                        <Col sm={12} lg={12} className="pt-3">
                                            <span className="toolBadge mr-2">
                                                <SVGIcon name="newtoolicon" fill={'#ffffff'} className="badgeSvg mr-2"  viewBox="-2 -2 22 22"/>
                                                <span>Tool</span> 
                                            </span>
                                            
                                            {!data.categories.category ? '' :  activeLink === true ? <a href={'/search?search=' + data.categories.category}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{data.categories.category}</div></a> : <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{data.categories.category}</div> }

                                            {!data.categories.programmingLanguage || data.categories.programmingLanguage.length <= 0 ? '' : data.categories.programmingLanguage.map((language) => {
                                                if (activeLink===true){
                                                    return <a href={'/search?search=' + language}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{language}</div></a>
                                                }
                                                else {
                                                    return <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{language}</div>
                                                }
                                            })}

                                            {!data.tags.features || data.tags.features.length <= 0 ? '' : data.tags.features.map((feature) => {
                                                if (activeLink===true){
                                                    return <a href={'/search?search=' + feature}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{feature}</div></a>
                                                }
                                                else {
                                                    return <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{feature}</div>
                                                }
                                            })}

                                            {!data.tags.topics || data.tags.topics.length <= 0 ? '' : data.tags.topics.map((topic) => {
                                                if (activeLink===true){
                                                    return <a href={'/search?search=' + topic}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{topic}</div></a>
                                                }
                                                else {
                                                    return <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{topic}</div>
                                                }
                                            })}
                                        </Col> 
                                        <Col sm={12} lg={12} className="pt-3">
                                            <span className="gray800-14">
                                                {data.description.substr(0, 140) + (data.description.length > 140 ? '...' : '')}
                                            </span>
                                        </Col> 
                                    </Row>   
                                );
                            }
                            else if (data.type === 'project') {
                                return(
                                    <Row>
                                        <Col sm={10} lg={10}>
                                            {activeLink===true ?
                                            <a className="black-bold-16" style={{ cursor: 'pointer' }} href={'/project/' + data.id} >{data.name}</a>
                                            : <span className="black-bold-16"> {data.name}</span> }
                                            <br />
                                            {!data.persons || data.persons <= 0 ? <span className="gray800-14">Author not listed</span> : data.persons.map((person, index) => {
                                                if (index > 0) {
                                                    if (activeLink===true){
                                                        return <><span className="reviewTitleGap gray800-14">·</span><a className="gray800-14" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a></>
                                                    }
                                                    else {
                                                        return <span className="gray800-14">, {person.firstname} {person.lastname}</span>
                                                    }
                                                }
                                                else {
                                                    if (activeLink===true){
                                                        return <a className="gray800-14" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a>
                                                    }
                                                    else {
                                                        return <span className="gray800-14">{person.firstname} {person.lastname}</span>
                                                    }
                                                }
                                            })}
                                        </Col> 
                                        <Col sm={2} lg={2}>
                                            {this.props.showRelationshipAnswer && relatedObject.updated || this.props.collectionUpdated ? <span className="gray700-13 mr-2 floatRight">{relatedObject.updated ? 'Updated ' + relatedObject.updated.substring(3) : 'Updated ' + this.props.collectionUpdated.substring(3)}</span> : ''}
                                            {this.props.showRelationshipQuestion ? <Button variant="medium" className="soft-black-14" onClick={this.removeButton} ><SVGIcon name="closeicon" fill={'#979797'} className="buttonSvg mr-2" />Remove</Button> : ''}
                                        </Col>
                                        <Col sm={12} lg={12} className="pt-3">
                                            <span className="projectBadge mr-2">
                                                <SVGIcon name="newestprojecticon" fill={'#ffffff'} className="badgeSvg mr-2" viewBox="-2 -2 22 22"/>
                                                <span>Project</span> 
                                            </span>
                                            
                                            {!data.categories.category ? '' : activeLink === true ? <a href={'/search?search=' + data.categories.category}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{data.categories.category}</div></a> : <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{data.categories.category}</div>}

                                            {!data.tags.features || data.tags.features.length <= 0 ? '' : data.tags.features.map((feature) => {
                                                if (activeLink===true){
                                                    return <a href={'/search?search=' + feature}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{feature}</div></a>
                                                }
                                                else {
                                                    return <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{feature}</div>
                                                }
                                            })}

                                            {!data.tags.topics || data.tags.topics.length <= 0 ? '' : data.tags.topics.map((topic) => {
                                                if (activeLink===true){
                                                    return <a href={'/search?search=' + topic}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{topic}</div></a>
                                                }
                                                else {
                                                    return <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{topic}</div>
                                                }
                                            })}
                                        </Col>  
                                        <Col sm={12} lg={12} className="pt-3">
                                            <span className="gray800-14">
                                                {data.description.substr(0, 140) + (data.description.length > 140 ? '...' : '')}
                                            </span>
                                        </Col> 
                                    </Row>  
                                );
                            }
                            else if (data.type === 'paper') {
                                return(
                                    <Row>
                                        <Col sm={10} lg={10}>
                                            {activeLink===true ?
                                            <a className="black-bold-16" style={{ cursor: 'pointer' }} href={'/paper/' + data.id} >{data.name}</a>
                                            : <span className="black-bold-16"> {data.name}</span> }
                                            <br />
                                            {!data.persons || data.persons <= 0 ? <span className="gray800-14">Author not listed</span> : data.persons.map((person, index) => {
                                                if (index > 0) {
                                                    if (activeLink===true){
                                                        return <><span className="reviewTitleGap gray800-14">·</span><a className="gray800-14" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a></>
                                                    }
                                                    else {
                                                        return <span className="gray800-14">, {person.firstname} {person.lastname}</span>
                                                    }
                                                }
                                                else {
                                                    if (activeLink===true){
                                                        return <a className="gray800-14" href={'/person/' + person.id}>{person.firstname} {person.lastname}</a>
                                                    }
                                                    else {
                                                        return <span className="gray800-14">{person.firstname} {person.lastname}</span>
                                                    }
                                                }
                                            })}
                                        </Col> 
                                        <Col sm={2} lg={2}>
                                            {this.props.showRelationshipAnswer && relatedObject.updated || this.props.collectionUpdated ? <span className="gray700-13 mr-2 floatRight">{relatedObject.updated ? 'Updated ' + relatedObject.updated.substring(3) : 'Updated ' + this.props.collectionUpdated.substring(3)}</span> : ''}
                                            {this.props.showRelationshipQuestion ? <Button variant="medium" className="soft-black-14" onClick={this.removeButton} ><SVGIcon name="closeicon" fill={'#979797'} className="buttonSvg mr-2" />Remove</Button> : ''}
                                        </Col>
                                        <Col sm={12} lg={12} className="pt-3">
                                            <span className="paperBadge mr-2">
                                                <SVGIcon name="newprojecticon" fill={'#3c3c3b'} className="badgeSvg mr-2"  viewBox="-2 -2 22 22"/>
                                                <span>Paper</span> 
                                            </span>
                                            {!data.tags.features || data.tags.features.length <= 0 ? '' : data.tags.features.map((feature) => {
                                                if (activeLink===true){
                                                    return <a href={'/search?search=' + feature}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{feature}</div></a>
                                                }
                                                else {
                                                    return <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{feature}</div>
                                                }
                                            })}

                                            {!data.tags.topics || data.tags.topics.length <= 0 ? '' : data.tags.topics.map((topic) => {
                                                if (activeLink===true){
                                                    return <a href={'/search?search=' + topic}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{topic}</div></a>
                                                }
                                                else {
                                                    return <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{topic}</div>
                                                }
                                            })}
                                        </Col>  
                                        <Col sm={12} lg={12} className="pt-3">
                                            <span className="gray800-14">
                                                {data.description.substr(0, 140) + (data.description.length > 140 ? '...' : '')}
                                            </span>
                                        </Col> 
                                    </Row>
                                );
                            }
                            else if (data.type === 'person') {
                                return(
                                    <Row>
                                        <Col xs={2} md={1} className="iconHolder">
                                            <div class="avatar-circle">
                                                <span class="initials"> {data.firstname ? data.firstname.charAt(0).toUpperCase() : ''}{data.lastname ? data.lastname.charAt(0).toUpperCase() : ''}</span>
                                            </div>
                                        </Col>
                                        <Col sm={8} lg={9}>
                                            {activeLink===true ? 
                                            <a className="black-bold-16" style={{ cursor: 'pointer' }} href={'/person/' + data.id} >{data.firstname && data.lastname ? data.firstname + ' ' + data.lastname : ''}</a> 
                                            : <span className="black-bold-16"> {data.firstname && data.lastname ? data.firstname + ' ' + data.lastname : ''} </span>
                                            }
                                            <br />
                                            <span className="gray800-14"> {data.bio} </span>
                                        </Col>
                                        <Col sm={2} lg={2}>
                                            {this.props.showRelationshipAnswer && relatedObject.updated || this.props.collectionUpdated ? <span className="gray700-13 mr-2 floatRight">{relatedObject.updated ? 'Updated ' + relatedObject.updated.substring(3) : 'Updated ' + this.props.collectionUpdated.substring(3)}</span> : ''}
                                            {this.props.showRelationshipQuestion ? <Button variant="medium" className="soft-black-14" onClick={this.removeButton} ><SVGIcon name="closeicon" fill={'#979797'} className="buttonSvg mr-2" />Remove</Button> : ''}
                                        </Col>
                                    </Row>
                                );
                            }
                            else { //default to dataset
                                return (
                                    <Row>
                                        <Col sm={10} lg={10}>
                                            {activeLink===true ?
                                            <a className="black-bold-16" style={{ cursor: 'pointer' }} href={'/dataset/' + data.id} >{data.title}</a>
                                            : <span className="black-bold-16"> {data.title} </span> }
                                            <br />
                                            <span className="gray800-14"> {data.publisher} </span>
                                        </Col>
                                        <Col sm={2} lg={2}>
                                            {this.props.showRelationshipAnswer && relatedObject.updated || this.props.collectionUpdated ? <span className="gray700-13 mr-2 floatRight">{relatedObject.updated ? 'Updated ' + relatedObject.updated.substring(3) : 'Updated ' + this.props.collectionUpdated.substring(3)}</span> : ''}
                                            {this.props.showRelationshipQuestion ? <Button variant="medium" className="soft-black-14" onClick={this.removeButton} ><SVGIcon name="closeicon" fill={'#979797'} className="buttonSvg mr-2" />Remove</Button> : ''}
                                        </Col>
                                        <Col sm={12} lg={12} className="pt-3">
                                            <span className="dataSetBadge mr-2">
                                                <SVGIcon name="dataseticon" fill={'#ffffff'} className="badgeSvg mr-2"  viewBox="-2 -2 22 22"/>
                                                <span>Dataset</span>
                                            </span>
                                        </Col>  
                                        <Col sm={12} lg={12} className="pt-3">
                                            <span className="gray800-14">
                                                {(() => {
                                                    if (typeof data.description === 'undefined') {
                                                        if(data.abstract){
                                                        return data.abstract.substr(0, 140) + (data.abstract.length > 140 ? '...' : '')
                                                        }
                                                    }
                                                    else {
                                                        return data.description.substr(0, 140) + (data.description.length > 140 ? '...' : '')
                                                    }
                                                })()}
                                            </span>
                                        </Col> 
                                    </Row>
                                );
                            }
                        })()}
                        {(() => {
                            if (this.props.showRelationshipQuestion) { 
                                return (
                                    <>
                                        <Row className="mt-3">
                                            <Col xs={12}>
                                                {!inCollection ? <span className="gray800-14 mr-2">What's the relationship between these resources?</span> 
                                                : <span className="gray800-14 mr-2">What's the relationship of this entity to the collection? (optional)</span> }
                                            </Col>
                                        </Row>
                                        <Row className="testInput">
                                            <Col xs={12}>
                                            <input className="resultsCardInput"  value={this.state.reason} onChange={event => this.handleChange(this.props.objectId, event.target.value, data.type===undefined ? "dataset" : data.type)} />
                                            </Col>
                                        </Row>
                                    </>
                                )
                            }
                            else if (this.props.showRelationshipAnswer) {
                                return (
                                    <>
                                        <Row className="mt-3">
                                            <Col xs={12}>
                                                <div className="relationshipBar">
                                                    <span className="gray800-14 mr-2">Relationship</span>
                                                </div>  
                                            </Col>
                                        </Row>
                                        <Row className="mt-3">
                                            <Col xs={12}>
                                                <div className="relationshipAnswer">
                                                        <span className="gray700-13 mr-2">{relatedObject.user ? relatedObject.user : this.props.collectionUser}</span>
                                                        <span className="gray700-13 mr-2 floatRight">{relatedObject.updated ? relatedObject.updated : this.props.collectionUpdated}</span>
                                                    <br />
                                                    <span className="gray800-14 mr-2">{relatedObject.reason ? relatedObject.reason : this.props.collectionReason}</span> 
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                )
                            }
                        })()}
                    </div>
                </Col>
            </Row>
        );
    }
}

export default RelatedObject;
