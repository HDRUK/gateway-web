import React from 'react';
import axios from 'axios';
import Loading from '../commonComponents/Loading';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageNotFound from '../commonComponents/MessageNotFound';
import SVGIcon from '../../images/SVGIcon';
import './Dashboard.scss';

var baseURL = require('../commonComponents/BaseURL').getURL();

class YourAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        newData: [],
        userState: [],
        isLoading: true,
    };

    componentDidMount() {
        this.doMessagesCall();
    }

    doMessagesCall() {
        var apiToCall = '/api/v1/messages/' + this.state.userState[0].id;
        if (this.state.userState[0].role === 'Admin') {
            apiToCall = '/api/v1/messages/admin/' + this.state.userState[0].id;
        }

        axios.get(baseURL + apiToCall).then(res => {
            this.setState({
                newData: res.data.newData,
                isLoading: false,
            });
        });
    }

    dateSuffix(day) {
        switch (day % 10) {
            case 1:
                return day % 100 === 11 ? 'th' : 'st';
            case 2:
                return day % 100 === 12 ? 'th' : 'nd';
            case 3:
                return day % 100 === 13 ? 'th' : 'rd';
            default:
                return 'th';
        }
    }

    render() {
        const { newData, isLoading } = this.state;

        if (isLoading) {
            return <Loading />;
        }

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        return (
            <>
                <Row className='mt-3'>
                    <Col>
                        <span className='black-16 ml-2'>New notifications</span>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {newData.length <= 0 ? (
                            <MessageNotFound word='notifications' />
                        ) : (
                            newData.map(dat => {
                                if (!dat.tool[0]) {
                                    return <></>;
                                }

                                return (
                                    <div className='rectangle mt-1'>
                                        <Row>
                                            <Col xs={2} lg={1} className='iconHolder'>
                                                {(() => {
                                                    if (dat.tool[0].type === 'tool') {
                                                        return <SVGIcon name='toolicon' width={18} height={18} fill={'#3db28c'} />;
                                                    } else {
                                                        return <SVGIcon name='projecticon' width={20} height={24} fill={'#3db28c'} />;
                                                    }
                                                })()}
                                            </Col>

                                            <Col xs={10} lg={11} className='pl-2 pt-1 gray800-14-bold'>
                                                {(() => {
                                                    var messageDate = new Date(dat.messageSent);

                                                    var messageDateString =
                                                        messageDate.getDate() +
                                                        this.dateSuffix(messageDate.getDate()) +
                                                        ' ' +
                                                        monthNames[messageDate.getMonth()] +
                                                        ' ' +
                                                        messageDate.getFullYear() +
                                                        ' at ' +
                                                        messageDate.getHours() +
                                                        ':' +
                                                        messageDate.getMinutes();

                                                    if (dat.messageType === 'add') {
                                                        return (
                                                            <>
                                                                {messageDateString} - The {dat.tool[0].type}{' '}
                                                                <a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id}>
                                                                    {dat.tool[0].name}
                                                                </a>{' '}
                                                                is now available for review.
                                                            </>
                                                        );
                                                    } else if (dat.messageType === 'approved') {
                                                        if (dat.messageTo === 0) {
                                                            return (
                                                                <>
                                                                    {messageDateString} - The {dat.tool[0].type}{' '}
                                                                    <a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id}>
                                                                        {dat.tool[0].name}
                                                                    </a>{' '}
                                                                    has been approved.
                                                                </>
                                                            );
                                                        } else {
                                                            return (
                                                                <>
                                                                    {messageDateString} - Your {dat.tool[0].type}{' '}
                                                                    <a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id}>
                                                                        {dat.tool[0].name}
                                                                    </a>{' '}
                                                                    has been approved.
                                                                </>
                                                            );
                                                        }
                                                    } else if (dat.messageType === 'rejected') {
                                                        if (dat.messageTo === 0) {
                                                            return (
                                                                <>
                                                                    {messageDateString} - The {dat.tool[0].type}{' '}
                                                                    <a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id}>
                                                                        {dat.tool[0].name}
                                                                    </a>{' '}
                                                                    has been rejected.
                                                                </>
                                                            );
                                                        } else {
                                                            return (
                                                                <>
                                                                    {messageDateString} - Your {dat.tool[0].type}{' '}
                                                                    <a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id}>
                                                                        {dat.tool[0].name}
                                                                    </a>{' '}
                                                                    has been rejected.
                                                                </>
                                                            );
                                                        }
                                                    }
                                                })()}
                                            </Col>
                                        </Row>
                                    </div>
                                );
                            })
                        )}
                    </Col>
                </Row>
            </>
        );
    }
}

export default YourAccount;
