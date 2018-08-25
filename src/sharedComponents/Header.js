import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import Logo from '../media/user/logo.svg';
import Hamburger from './Hamburger';
import '../styles/sharedStyles.css'

class Header extends Component{
	state = {
		hamburger: { rotate1: 0, rotate3: 0, opacity2: 1, top1: -5, top3: 5 }
	}

	hamFuncRef = React.createRef();

	logout = () => {
		this.props.auth.logout('/');
		this.props.history.push('/');
	}

	hamburgerChange = (e) => {
		const { hamburger: { rotate1, rotate3, opacity2 } } = this.state;
		const mobileNav = document.querySelector("#mobile-nav");
		const bodyWrapper = document.querySelector(`.${this.hamFuncRef.current.dataset.body}`);
		mobileNav.classList.toggle("open");
		bodyWrapper.classList.toggle("slide-down");
		if( rotate1===0 && rotate3===0 && opacity2===1 ){
			this.setState({ hamburger: { rotate1: 25, rotate3: -25, opacity2: 0, top1: 2, top3: -2 }});
		}else{
			this.setState({ hamburger: { rotate1: 0, rotate3: 0, opacity2: 1, top1: -5, top3: 5 }});
		}
	}


	render(){
		const { username, fullName, firstNameFirstChar, logoutFunc, pageBodyWrapper } = this.props;
		const { hamburger: { rotate1, rotate3, opacity2, top1, top3 } } = this.state;
		return(
			<header >
				<div ref={this.hamFuncRef} data-body={pageBodyWrapper} className="user-header-wrapper">
					<Hamburger rotateVal_Top={rotate1} rotateVal_Bottom={rotate3} opacityVal_Middle={opacity2} PositionValue_Top={top1} PositionValue_Bottom={top3} clickFunction={this.hamburgerChange} />
					<div className="user-header-img-holder">
					</div>
				</div>
				<div id="mobile-nav">
					<div id="logout"><input onClick={logoutFunc} className="btn logout-btn mobile-nav-link" type="button" value="Logout" /></div>
				</div>

				<div className="header-info flex">
					<div className="center-header-info logo-and-name">
						<img className="header-logo" src={Logo} alt="Fastconnect" />
						<p className="header-user-name main">Welcome {username}!</p>
					</div>
					<div className="center-header-info flex">
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<p className="profile-name"style={{alignSelf: "center"}}>{fullName}</p>
							<input onClick={logoutFunc} className="btn logout-btn" type="button" value="Logout" />
						</div>
					<div className="profile-image"><span className="prof-image-placeholder">{firstNameFirstChar}</span></div>
					</div>
				</div>
			</header>
		)
	}
}

export default withAuth(Header);