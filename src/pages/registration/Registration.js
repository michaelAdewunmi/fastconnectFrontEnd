import React, { Component } from 'react';
import oktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';

import Input from '../../sharedComponents/Input';
import PageLoadingModal from '../../sharedComponents/loadingModal';

import Envelope from '../../media/registration/env.svg';
import Phone from '../../media/registration/phone.svg';
import Logo from '../../media/shared/logo.png'
import User from '../../media/registration/user.svg';
import Lock from '../../media/registration/lock.svg';

import '../../styles/reg.css'




class Registration extends Component {

	state = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		retypedPassword: '',
		passwordsMismatch: true,
		sessionToken: null,
		loading: false
	};

	oktaAuth = new oktaAuth({ url: process.env.REACT_APP_OKTA_URL});

	async checkAuthentication(){
		const sessionToken = await this.props.auth.getIdToken();
		if(sessionToken) {
			this.setState({ sessionToken });
		}
	}

	componentDidMount() {
		this.checkAuthentication();
		document.querySelector('.body-div').style.height = "auto";
	}

	handleFirstNameChange = (e) => {
		this.setState({ firstName: e.target.value });
	}
	handleLastNameChange = (e) => {
		this.setState({lastName: e.target.value});
	}
	handleEmailChange = (e) => {
		this.setState({email: e.target.value});
	}
	handlePhoneNumberChange = (e) => {
		this.setState({phone: e.target.value});
	}
	handlePasswordChange = (e) => {
		this.setState({password: e.target.value});
	}
	handleRetypedPasswordChange = (e) => {
		this.setState({retypedPassword: e.target.value});
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const  { firstName, lastName, email, phone, password, retypedPassword } = this.state;
		if(!(firstName && lastName && email && phone && password)) return
		if( retypedPassword === password) {
			this.setState({ passwordsMismatch: '', loading: true });
			const newUser = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				phone: phone,
				password: password,
				sessionToken: null
			}
			fetch('/api/register', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newUser)
					}).then(user => {
				this.oktaAuth.signIn({
					username: this.state.email,
					password: this.state.password
				}).then(res => {
					this.setState({ sessionToken: res.sessionToken });
					this.props.history.push('/user');
				});
			}).catch(err => console.log);
		}else{
			this.setState({ passwordsMismatch: 'The Passwords do not match. Please Retype them!' });
			return;
		}
	}



	render() {

		const error = this.state.passwordsMismatch;
		if(this.state.sessionToken) {
			this.props.auth.redirect({ sessionToken: this.state.sessionToken });
			return null;
		}
		return (
			<div className='body-div flex-it'>
				<PageLoadingModal loading={this.state.loading} preferredLoadingWords='we load your information' />
				<div className='content' id='registration-wrapper'>
					<div className='reg-form-wrapper'>
						<div className="reg-header">
							<img src={Logo} className="brand-logo" alt="fastconnect" />
							<hr style={{background: '#7ca9c1'}} />
						</div>
						<form onSubmit={this.handleSubmit}>	
							<div style={{    maxWidth: '400px', margin: '0 auto', color: 'red'}}>{error}</div>
							<div className="input-cont">
								<Input icon={<img className='reg-icon' src={User}  alt="icon" />} labelFor="first-name" labelBody="First Name" onchangefunc={this.handleFirstNameChange} id="first-name" type="text" inputClass="input" />
								<Input icon={<img className='reg-icon' src={User}  alt="icon" />} labelFor="last-name" labelBody="Last Name" onchangefunc={this.handleLastNameChange} id="last-name" type="text" inputClass="input" />
								<Input icon={<img className='reg-icon' src={Envelope}  alt="icon" />} labelFor="email" labelBody="Valid Email Address" onchangefunc={this.handleEmailChange} id="email" type="email" inputClass="input" />
								<Input icon={<img className='reg-icon' src={Phone}  alt="icon" />} labelFor="phone" labelBody="Phone (example: 08055221111)" onchangefunc={this.handlePhoneNumberChange} id="phone" type="text" inputClass="input" />						
								<Input icon={<img className='reg-icon' src={Lock}  alt="icon" />} labelFor="password" labelBody="Strong Password" onchangefunc={this.handlePasswordChange} id="password" type="password" inputClass="input" />						
								<Input icon={<img className='reg-icon' src={Lock}  alt="icon" />} labelFor="retyped-password" labelBody="Retype above Password" onchangefunc={this.handleRetypedPasswordChange} id="retyped-password" type="password" inputClass="input" />						
								<hr style={{background: '#7ca9c1'}} />
								<div className="">
									<input className="btn var-1 var-2" type="submit" value="Register as a Reseller" id="okta-signin-submit" />
								</div>
							</div>	      
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default withAuth(Registration);