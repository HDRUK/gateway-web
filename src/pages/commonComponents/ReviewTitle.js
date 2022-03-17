import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SVGIcon from '../../images/SVGIcon';
import Loading from './Loading';

var baseURL = require('./BaseURL').getURL();

class ReviewTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state.id = props.id;
    }

    // initialize our state
    state = {
        id: '',
        data: [],
        isLoading: true,
    };

    componentDidMount() {
        this.doSearchCall();
    }

    doSearchCall() {
        axios.get(baseURL + '/api/v1/reviews?id=' + this.state.id).then(res => {
            this.setState({ data: res.data.data[0], isLoading: false });
        });
    }

    render() {
        const { data, isLoading } = this.state;

        if (isLoading) {
            return <Loading />;
        }

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var updatedDate = new Date(data.date);
        var updatedOnDate = updatedDate.getDate() + ' ' + monthNames[updatedDate.getMonth()] + ' ' + updatedDate.getFullYear();

        if (!data.tool[0]) {
            return <></>;
        }

        return (
            <Row className='mt-2'>
                <Col>
                    <div className='rectangle'>
                        <Row>
                            <Col xs={2} lg={1} className='iconHolder'>
                                <SVGIcon name='toolicon' width={18} height={18} fill={'#3db28c'} />
                            </Col>
                            <Col xs={10} lg={8}>
                                <p>
                                    <span className='black-16'>
                                        <a href={'/tool/' + data.tool[0].id}>
                                            {data.tool[0].name.substr(0, 75) + (data.tool[0].name.length > 75 ? '...' : '')}
                                        </a>
                                    </span>
                                </p>
                            </Col>
                            <Col xs={12} lg={12}>
                                <p>
                                    <span className='gray800-14'>"{data.review}"</span>
                                </p>
                            </Col>
                            <Col xs={12} lg={12}>
                                <span className='purple-13'>
                                    {data.person[0].firstname} {data.person[0].lastname}
                                </span>
                                <span className='gray700-13'> on {updatedOnDate}</span>
                                {!data.projectName ? (
                                    ''
                                ) : (
                                    <>
                                        <span className='reviewTitleGap'>·</span>
                                        <span className='gray700-13'> in relation to project </span>
                                        <span className='purple-13'>{data.projectName}</span>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default ReviewTitle;
