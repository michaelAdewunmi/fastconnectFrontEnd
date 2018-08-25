import React, {Component} from 'react';
import RavePaymentModal from 'react-ravepayment';
import { withAuth } from '@okta/okta-react';

import Input from '../../sharedComponents/Input';
import Header from '../../sharedComponents/Header';

import PageLoadingModal from '../../sharedComponents/loadingModal';

import Logo from '../../media/shared/logo.svg';
import Flutterwave_Trusted from '../../media/makepayment/Flutterwave_Trusted.png';
import '../../styles/makePayment.css';

class CheckoutPage extends Component {

	state = {
		authenticated: null,
		user: null,
		id: '',
        phone: null,
        amount: 0,
        paymentRef: '',
        paymentSuccess: false,
        oktawallet: '',
        paymentCount: '',
        loading: true,
        verResponse: null,
	}

	componentDidMount() {
		this.checkAuthentication();
	}

	async checkAuthentication() {
		const authenticated = await this.props.auth.isAuthenticated();
		if(authenticated !== this.state.authenticated) {
			const user = await this.props.auth.getUser();
			this.setState({ authenticated, user });
			this.getReference();
			this.getUserWallet();
		}
	}

	getUserWallet = () => {
		fetch(`${process.env.REACT_APP_OKTA_USER_UPDATE_BASE_URL}${this.state.user.sub}`, {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `SSWS ${process.env.REACT_APP_OKTA_AUTHORIZATION_TOKEN}`
			},
		}).then( res => { 
			res.json()
			.then(data => {
				this.setState({ oktawallet: data.profile.wallet, paymentCount: data.profile.paymentcount, loading: false });
			})
		}).catch(err => console.log('Sorry! Could not get user'));
	}
	
	getReference() {
		let text= `${this.state.user.email}/`;
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

		for( let i=0; i < 10; i++ ){
			this.setState({paymentRef: (text+=possible.charAt(Math.floor(Math.random() * possible.length)))});
		}
	}

	callback = (response) => {
		const txref = response.tx.txRef;
		if ((response.tx.chargeResponseCode==='00' || response.tx.chargeResponseCode==='0') && response.tx.status==="successful") {
			this.setState({paymentSuccess: true})
			const paymentDetails = {
				id: this.state.user.sub,
				paymentRef: txref,
				amount: this.state.amount,
				oktaWallet: this.state.oktawallet,
				oktaPaymentCount: this.state.paymentCount
			}
			fetch('/api/user/verifypayment', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(paymentDetails)
			}).then(res => {
				res.json().then(data => {
					this.setState({ verResponse: data  })
					//this.props.history.push('/user');
				});
			});
		}else{
			this.setState({paymentSuccess: "not successful"})
		}
	}

	close = () => {
		console.log("Modal Closed!");
	}

	onPhoneNumberChange = (e) => {
		this.setState({ phone: e.target.value});
	}

	onAmountChange = (e) => {
		this.setState({ amount: Number(e.target.value)});
	}
	onIdChange = (e) => {
		this.setState({ id: e.target.value});
	}

	logout = () => {
		this.props.auth.logout('/');
		this.props.history.push('/');
	}

	render() {
		const apiPublicKey = process.env.REACT_APP_RAVE_PUBLIC_KEY;
		const authenticated = this.state.authenticated;
		if(authenticated === null || authenticated === false) return (
			<div className='notification-div'>
				<div style={{maxWidth: '800px', margin: '0 auto'}}>
					<h1 style={{fontSize:'16px'}} className='notification-body'>Pls Wait! while we try to verify your Account...</h1>
					</div>
				</div>
			)
		const { user, user: { given_name, name }, loading, verResponse } = this.state
		if(this.state.paymentSuccess===true && verResponse && verResponse.PaymentVerification===true && verResponse.userDBerror===null) {
				return( <div className='notification-div'>
							<div style={{maxWidth: '800px', margin: '0 auto'}}>
								<h1 className='notification-body'>Oya Na! Everything don set! Go Buy data jor!</h1>
								<a href='/user' className='btn var-1 var-2 href-link'>Carry me go my Dommot</a>
							</div>
						</div>)
		}else if(this.state.paymentSuccess===true && verResponse===null){
			return(<div className='notification-div'>
						<div style={{maxWidth: '800px', margin: '0 auto'}}>
							<PageLoadingModal loading={true} preferredLoadingWords='we Credite your account' />
							<h1 className='notification-body'>Your Payment was successful! Please Wait while we credit your Account...</h1>
						</div>
					</div>)
		}else if(verResponse && verResponse.PaymentVerification===false) {
			return <div className='notification-div'><div style={{maxWidth: '800px', margin: '0 auto'}}><h1 className='notification-body'>Your Account could not been Credited. Please Contact us ASAP!..</h1></div></div>
		}
		return (
			<div style={{background: '#d7dfff', minHeight: '100vh'}}>
				<PageLoadingModal loading={loading} preferredLoadingWords='we verify your account' />
				<Header pageBodyWrapper='page-body' username={user && given_name} fullName={user && name} firstNameFirstChar={user && given_name.slice(0, 1)} logoutFunc={this.logout} />
				<div className='page-body'>
					<p className="header-user-name mobile">Welcome {user && user.name}!</p>
					<img className='flutterwave-secure-logo' src={Flutterwave_Trusted} alt='fastconnect trusted payment process' />
					<div id="form-container" className="form-container">
						<Input labelFor="id" labelBody="Identification" onchangefunc={this.onIdChange} onchangeVal={this.state.id} id="id" type="text" inputClass="input" />
						<Input labelFor="phoneNumber" labelBody="Phone Number" onchangefunc={this.onPhoneNumberChange} id="phoneNumber" type="text" inputClass="input" />
						<Input labelFor="Amount" labelBody="Amount" onchangefunc={this.onAmountChange} id="amount" type="number" inputClass="input" />
						<div className='rave-payment'>
							<RavePaymentModal 
								text='Pay Now' 
								class='btn payButton' 
								metadata= {[{metavalue: this.state.purchased}]}
								customer_firstname= {this.state.user.name}
								customer_phone = {this.state.phone}
								custom_logo = {`http://localhost:3000${Logo}`}
								email={this.state.user.email}
								amount={this.state.amount}
								ravePubKey={apiPublicKey}
								callback={this.callback}
								close={this.close}
								reference={this.state.paymentRef}
								custom_title='Checkout Page'
								custom_description= 'Never Worry! Your information is encrypted!'
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withAuth(CheckoutPage);