import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';
import Logo from '../../../media/shared/logo.png'

export default class OktaSignInWidget extends Component {

	componentDidMount() {
		const el = ReactDOM.findDOMNode(this);
		this.widget = new OktaSignIn({
			baseUrl: this.props.baseUrl,

			logo: Logo,

			i18n: {
		        'en': {
		            'primaryauth.title': 'Sign in into your FastConnect Wallet',
		            'primaryauth.submit': 'Connect to My Wallet',
		            'primaryauth.username.placeholder': 'Email',
		            'primaryauth.username.tooltip': 'Enter your email here', 
		            'primaryauth.password.tooltip': 'Your Password here',
		        }
		    },
		});
		this.widget.renderEl({el}, this.props.onSuccess, this.props.onError);
	}

	componentWillUnmount() {
		this.widget.remove();
	}

	render() {
		return <div />;
	}
};