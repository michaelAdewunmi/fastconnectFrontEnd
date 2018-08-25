import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import OktaSignInWidget from './components/OktaSignInWidget';

class Login extends Component {

	state = {
		authenticated: null,
	};

	async checkAuthentication() {
		const authenticated = await this.props.auth.isAuthenticated();
		if(authenticated !== this.state.authenticated) {
			this.setState({ authenticated });
		}
	}

	componentDidMount() {
		this.checkAuthentication();
	}

	componentDidUpdate() {
		this.checkAuthentication();
	}

	onSuccess = (res) => {
		if( res.status === 'SUCCESS' ) {
			this.setState({ authenticated: this.props.auth.isAuthenticated() });
			return this.props.auth.redirect( { sessionToken: res.session.token });
		} else {
			console.log('Sorry! Can\'t be Authenticated');
		}
	}

	onError = (err) => {
		console.log('error logging in', err);
	}

	render() {
		if(this.state.authenticated === null) return null;

		return this.state.authenticated ? 
			<Redirect to={{ pathname: '/user' }} /> : 
			<div className='body-div flex-it'>
				<OktaSignInWidget
					baseUrl={this.props.baseUrl}
					onSuccess={this.onSuccess}
					onError={this.onError}
				/>
				<div className="register-div">
					<a href='/register' className='registration-link'>Register as a RESELLER NOW!</a>
				</div>
			</div>
	}
}

export default withAuth(Login);