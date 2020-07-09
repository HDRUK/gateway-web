import React from 'react';
import axios from 'axios';
import { Row, Col }  from 'react-bootstrap/';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AccountGADashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        userState: [],
        totalGAUsers: null,
        gaUsers: null,
        isLoading: true
    };
  
    componentDidMount() {
        this.getTotalGAUsers();
        //pass in any start date and end date to get the amount of unique users within that timeframe
        this.getGAUsers('2020-06-09', '2020-07-09');
    }

    getTotalGAUsers(){
        axios.get(baseURL + '/api/v1/analyticsdashboard/totalusers')
        .then((res) => {
            console.log('res is: ' + JSON.stringify(res.data.data.rows[0][0]))
            this.setState({ totalGAUsers: res.data.data.rows[0][0] , isLoading: false });
        });
    }    

    getGAUsers(startDate, endDate){
        axios.get(baseURL + '/api/v1/analyticsdashboard/userspermonth?startDate=' + startDate + '&endDate=' + endDate)
        .then((res) => {
            console.log('res is: ' + JSON.stringify(res.data.data.rows[0][0]))
            this.setState({ gaUsers: res.data.data.rows[0][0] , isLoading: false });
        });
    } 

  
    render() {
        const { totalGAUsers, gaUsers } = this.state;
  
        return (
            <div>
                <Row className="mt-2">
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <div className="rectangle">
                            <Row>
                                <span className="black-16" data-testid="title">Total unique users: {totalGAUsers}</span>
                            </Row>
                            <Row>
                                <span className="black-16" data-testid="title">Unique users in the last month: {gaUsers}</span>
                            </Row>
                        </div>
                    </Col>
                    <Col sm={1} lg={10} />
                </Row>
            </div>
        );
    }
}

  export default AccountGADashboard;