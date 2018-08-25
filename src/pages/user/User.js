import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import moment from 'moment';

import Wallet from '../../media/user/wallet.svg';
import Card from '../../media/user/card.svg';
import UserIcon from '../../media/user/user-icon.svg';

import Header from '../../sharedComponents/Header';
import UserProfileInfo from './components/ProfileInfo';
import OverviewComponentBody from './components/AccountOverview';
import ProfileHeading from './components/ProfileHeading';
import ProfileButtons from './components/ProfileButtons';
import UserInfoTop from './components/UserInfoDisplayTop';
import AcctActivityTop from './components/AccountActivity';
import TransactionActivity from './components/PaymentActivity';
import HistoryHeading from './components/HistoryHeading';
import PageLoadingModal from '../../sharedComponents/loadingModal';


import '../../styles/user_page.css';


class User extends Component {
	
	state = {
		authenticated: null, user: null, loading: true, gotUser: null,
		update: { email: "", phone: "", firstName: "", lastName: "", location: "" },
		oktaRes: '', internalDbRes: '', transactions: '', paymentHistory: '', purchaseHistory: ''
	};

	componentDidMount() {
		this.checkAuthentication();
	}

	componentDidUpdate() {
		this.checkAuthentication();
	}

	async checkAuthentication() {
		const authenticated = await this.props.auth.isAuthenticated();
		if( authenticated !== this.state.authenticated && authenticated !== false ){
			const user = await this.props.auth.getUser();
			this.setState({ authenticated, user })
			this.findUserInfo()
		}
	}

	findUserInfo() {
		if(!this.state.user.email) {
			return null;
		}
		const userEmail= { email: this.state.user.email }
		fetch(`/user/${userEmail.email}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then( res => { 
			res.json()
			.then(data => {
				this.setState({
					internalDbRes: data.userData[0],
					transactions: data.userData[0].paymentcount + data.userData[0].purchasecount,
					paymentHistory: data.paymentHistory,
					purchaseHistory: data.purchaseHistory
				});
			})
		}).catch(err => console.log('There was an Error'));
		fetch(`${process.env.REACT_APP_OKTA_USER_UPDATE_BASE_URL}${this.state.user.sub}`, {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `SSWS ${process.env.REACT_APP_OKTA_AUTHORIZATION_TOKEN}`
			},
		}).then( res => { 
			res.json()
			.then(user => {
				this.setState({
					oktaRes: user.profile,
				});
				this.setUpdate();
			})
		}).catch(err => console.log('Could not get User'));
	}

	editUserInfo = () => {
		const profileDivs = document.querySelectorAll(".detail-section");
		const userprofileParent = document.querySelector("#user-profile-info");
		profileDivs.forEach( profileDiv => {
			profileDiv.classList.add("getit");
		})
		userprofileParent.classList.add("editing");
	}

	onEmailChange  = (e) => {
		this.setState ({ update: {	email: e.target.value, } });
	}

	onFirstNameChange  = (e) => {
		this.setState ({ update: { firstName: e.target.value, } });
	}

	onLastNameChange  = (e) => {
		this.setState ({ update: { lastName: e.target.value, } });
	}

	onPhoneNumberChange  = (e) => {
		this.setState ({ update: { phone: e.target.value, } });
	}

	onLocationChange  = (e) => {
		this.setState ({ update: { location: e.target.value, } });
	}

	setUpdate = () => {
		if(this.state.user != null){
			const { user: {email, given_name, family_name, zoneinfo}, oktaRes: { mobilePhone } } = this.state;
			this.setState({
				update: { email: email, firstName: given_name, lastName: family_name, location: zoneinfo, phone: mobilePhone  },
				loading: false,
			});
		}	
	}

	cancelEditing = () => {
		this.setUpdate()
		const profileDivs = document.querySelectorAll(".detail-section");
		const userprofileParent = document.querySelector("#user-profile-info");
		profileDivs.forEach( profileDiv => {
			profileDiv.classList.remove("getit");
		})
		userprofileParent.classList.remove("editing");
	}

	userFriendlyNumber = (input) => {
		var str = input.toString(), strLength = str.length, newStr = "", count = 0;
		for(let n=strLength; n>0; n--) {
			count++;
			newStr += str.charAt(n-1);
			if((count%3)===0 && count!==strLength) {
				newStr += " ,";
			}
		}
		return newStr.split("").reverse().join("");
	}

	logout = () => {
		this.props.auth.logout('/');
		this.props.history.push('/');
	}

	render() {
		const { authenticated, gotUser } = this.state;
		if(authenticated === null || authenticated === false) return <PageLoadingModal loading={true} preferredLoadingWords='we check your Account'/>;
		if(gotUser===false) return null;
		const {
			paymentHistory, purchaseHistory,
			user, user: { email, family_name, given_name, zoneinfo }, internalDbRes, loading,
			oktaRes: { wallet, paymentcount, purchasecount, mobilePhone }, update, transactions, 
		} = this.state

		const getPaymentHistory = (DataHistory, Transactiontype) => {
			if(Object.keys(DataHistory).length===0) {
				return <p className='no-transaction'>You have not made any {Transactiontype} in 30 days</p>;
			}
			const allRows = [];
			Object.entries(DataHistory).forEach(([key, value]) => {
				const status = (value.approved===true) ? "Approved" : "Pending"
				const statusClass = (value.approved===true) ? "successful" : "pending"
				if(value.paidintowallet===true) {
					const output = <div key={value.id}><TransactionActivity transactionHeading='Payment Detail' bodyCopy={`A sum of ${value.trnzctnamount} was paid into wallet`} date={moment(value.trnzctndate).fromNow()} tranzctnstatus={status} paragraphClass='successful' /><hr className="no-margin" /></div>;
					allRows.push(output);
				}else{
					const output = <div key={value.id}><TransactionActivity transactionHeading='Purchase Detail' bodyCopy={`${value.itemvolume} ${value.itemnetwork} data was bought`} date={moment(value.trnzctndate).fromNow()} tranzctnstatus={status}  paragraphClass={statusClass}/><hr className="no-margin"/></div>;
					allRows.push(output);
				}
			})
			return allRows;
		}
		return (
			<div className='content-div'>
				<PageLoadingModal loading={loading} preferredLoadingWords='we Load your Account Data'/>
				<Header pageBodyWrapper='page-body' username={user && given_name} fullName={user && user.name} firstNameFirstChar={user && given_name.slice(0, 1)} logoutFunc={this.logout}/>
				<div className="user-info page-body">
					<p className="header-user-name mobile">Welcome {user && given_name}!</p>
					<div className="user-account-details flex">
						<div className="user-profile-internal flex">
							<UserInfoTop heading='Account Balance' displayInfo={internalDbRes && this.userFriendlyNumber(internalDbRes.wallet)} infoComplement='NGN' extraClassName='info-complement' />
							<UserInfoTop heading='Payment Counts' displayInfo={internalDbRes.paymentcount} infoComplement='payments' />
							<UserInfoTop heading='Purchase Counts' displayInfo={internalDbRes.purchasecount} infoComplement='purchases' />
							<UserInfoTop heading='Transactions' displayInfo={transactions} infoComplement='Transactions' />
						</div>
						<div id="user-profile-info" className="profile-top flex">
							<div className="card profile-section">
								<ProfileHeading imagePlaceholder={user && given_name.slice(0, 1)} />
								<hr />
								<UserProfileInfo infoLabel={[user && email]} InputOptionVal={[update.email]} InputOnchangeFunc={[this.onEmailChange]} extraClass_Wrapper="single-info" />
								<UserProfileInfo infoLabel={[user && given_name, user && family_name]} InputOptionVal={[update.firstName, update.lastName]} InputOnchangeFunc={[this.onFirstNameChange, this.onLastNameChange]} extraClass_Wrapper="double-info-holder" extraClass_Content="half-width" />
								<UserProfileInfo infoLabel={[mobilePhone, user && zoneinfo]} InputOptionVal={[update.phone, update.location]} InputOnchangeFunc={[this.onPhoneNumberChange, this.onLocationChange]} extraClass_Wrapper="double-info-holder" extraClass_Content="half-width" />
								
								<ProfileButtons editBtnClickFunc={this.editUserInfo} cancelBtnClickFunc={this.cancelEditing} saveBtnClickFunc={this.saveEdit} />
							</div>

							{/*AccountBrief or AccountOverviewSection*/}
							<div className="card account-brief ">
								<div className="card-section-head flex padded">
									<div style={{marginLeft: "0"}} className="profile-heading-wrapper">
										<h3 className="profile"style={{alignSelf: "center"}}>My Account Overview</h3>
										<span style={{marginTop: "4px"}}>A summary of your account activities</span>
									</div>
								</div>
								<hr />
								<OverviewComponentBody icon={UserIcon} paragraphCopy={["User", `Since ${moment(internalDbRes && internalDbRes.joined).fromNow()}`]}spanCopy="valued and Trusted User" /><hr />
								<OverviewComponentBody icon={Wallet} paragraphCopy={[wallet && this.userFriendlyNumber(wallet), "NGN"]} spanCopy="still in your Wallet" extraClass_Paragraph="inline" /><hr />
								<OverviewComponentBody icon={Card} paragraphCopy={[paymentcount+purchasecount, "Transactions made"]} spanCopy={`${purchasecount} purchases & ${paymentcount} payments`} />
							</div>
						</div>
						<div id="acct-activity-wrapper">
							<div className="card acct-activity">
								<AcctActivityTop acctBalance={`${wallet} NGN`} AcctId='FC-018-024-DY' paymentcount={`${paymentcount}`} purchasecount={`${purchasecount}`} />
							</div>
						</div>
						<div id="acct-activity-wrapper">
							<div className="card acct-activity">
								<HistoryHeading historyType='Payments' /><hr />
								<div className="section-wrapper">
									{getPaymentHistory(paymentHistory, "Payment")}
									<div className="rows-wrapper flex acct transact-wrapper">
										<a href="/makepayment" className="payment-link large add-funds">Add Funds Now</a>
									</div>
								</div>
							</div>
							<div className="card acct-activity">
								<HistoryHeading historyType='Purchases' /><hr />
								<div className="section-wrapper">
									{getPaymentHistory(purchaseHistory, "Purchase")}
									<div className="rows-wrapper flex acct transact-wrapper">
										<a href="/buydata" className="payment-link large">Purchase Data Now</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withAuth(User);