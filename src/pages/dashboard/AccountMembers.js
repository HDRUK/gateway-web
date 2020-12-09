import React, { Fragment } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap';
import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading';
import '../../css/styles.scss';
import './Dashboard.scss';
import AccountMembersModal from './AccountMemberModal';
import { initGA } from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AccountMembers extends React.Component {
	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		this.accountMembers = props.team;
		this.accountMembersId = props.teamId;
	}

	// initialize our state
	state = {
		userState: [],
		isLoading: true,
		members: [],
		userIsManager: false,
		showAccountAddMemberModal: false,
	};

	componentDidMount() {
		initGA('UA-166025838-1');
		this.doMembersCall();
	}

	async doMembersCall() {
		if (this.accountMembersId) {
			this.setState({ isLoading: true });
			await axios.get(baseURL + `/api/v1/teams/${this.accountMembersId}/members`).then(async res => {
				this.setState({ members: res.data.members });

				this.setState({
					userIsManager: res.data.members.filter(m => m.id === this.state.userState[0].id).map(m => m.roles[0] === 'manager')[0],
				});
			});
		}
		this.setState({ isLoading: false });
	}

	onShowAccountMembersModal = () => {
		this.setState(prevState => {
			return {
				showAccountAddMemberModal: !prevState.showAccountAddMemberModal,
			};
		});
	};

	onMemberAdded = members => {
		this.setState({ members });
	};

	render() {
		const { isLoading, members, showAccountAddMemberModal } = this.state;
		if (isLoading) {
			return (
				<Row>
					<Col xs={1}></Col>
					<Col xs={10}>
						<Loading />
					</Col>
					<Col xs={1}></Col>
				</Row>
			);
		}

		return (
			<Fragment>
				<Row>
					<Col xs={1}></Col>
					<Col xs={10}>
						<Row className='accountHeader'>
							<Col sm={12} md={9}>
								<Row className=''>
									<span className='black-20'>Members</span>
								</Row>
								<Row>
									<span className='gray700-13'>
										To remove team members or change their roles, please raise a support ticket at the following link:
									</span>
								</Row>
								<Row>
									<span className='purple-13 pad-bottom-24'>
										{' '}
										<a href='https://hdruk.atlassian.net/servicedesk/customer/portal/1'>
											https://hdruk.atlassian.net/servicedesk/customer/portal/1
										</a>
									</span>
								</Row>
								<Row>
									<span className='gray700-13 pad-bottom-24'>
										Managers can; manage members, create and assign workflows, review applications that are assigned to them and make the
										final decision on data access request applications.
									</span>
								</Row>
								<Row>
									<span className='gray700-13'>Reviewers can review applications that are assigned to them.</span>
								</Row>
							</Col>

							<Col sm={12} md={3} style={{ textAlign: 'right' }}>
								{this.state.userIsManager ? (
									<Button variant='primary' className='addButton' onClick={e => this.onShowAccountMembersModal()}>
										+ Add a new member
									</Button>
								) : (
									''
								)}
							</Col>
						</Row>

						{(() => {
							return (
								<div>
									{members.length <= 0 ? (
										''
									) : (
										<Row className='subHeader mt-3 gray800-14-bold'>
											<Col xs={5}>Name</Col>
											<Col xs={4}>Role</Col>
											<Col xs={3}></Col>
										</Row>
									)}
									{members.length <= 0 ? (
										<Row className='margin-right-15'>
											<NotFound word='members' />
										</Row>
									) : (
										members.map(m => {
											return (
												<Row className='entryBox padding-left-20 '>
													<Col sm={12} lg={5}>
														<a href={'/person/' + m.id} className='purple-14'>
															{m.firstname} {m.lastname}
														</a>
														<Row sm={5} lg={5}>
															<Col sm={10} lg={10} className='gray-600-14 ellipsis'>
																{m.organisation ? m.organisation : m.bio}
															</Col>
														</Row>
													</Col>
													<Col sm={4} lg={4} className='black-14'>
														{m.roles[0].charAt(0).toUpperCase() + m.roles[0].slice(1)}
													</Col>
												</Row>
											);
										})
									)}

									<AccountMembersModal
										open={showAccountAddMemberModal}
										close={this.onShowAccountMembersModal}
										teamId={this.accountMembersId}
										onMemberAdded={this.onMemberAdded}></AccountMembersModal>
								</div>
							);
						})()}
					</Col>
					<Col xs={1}></Col>
				</Row>
			</Fragment>
		);
	}
}

export default AccountMembers;
