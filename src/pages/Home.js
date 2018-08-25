import React, { Component } from 'react';
import ReactVivus from 'react-vivus';
import '../styles/home.css';

import logo from '../media/shared/logo.svg';
import brandname from '../media/home/brandname.svg'

class Home extends Component {
	componentDidMount() {
		const brandname = document.querySelector('.brandname');
		const homeLogo = document.querySelector('.home-logo');
		const homeHeading = document.querySelector('.home-heading');
		brandname.style.transform = "translateX(0)";
		brandname.style.opacity = "1";
		homeLogo.style.transform = "scale(1)";
		homeLogo.style.opacity = "1";
		homeHeading.style.transform = "scale(0.7)";
		homeHeading.style.opacity = "1";
	}

	render() {
		return (
			<div className='content-div home'>
				<div className="content-wrapper-home">
					<div className="home-descriptio">
						<div className='home-logo'>
							<ReactVivus
								id="svg-container"
								option={{
									file: logo, //path of the animated logo
									animTimingFunction: 'EASE-IN-OUT',
									type: 'oneByOne',
									duration: 150
								}}
							/>
						</div>
						<img className="brandname" src={brandname} alt="fastconnect" />
						<h1 className="home-heading">Welcome Home</h1>
					</div>
					<div className="home-navigation">
						<a href="/login" className="home-links">Login</a> 
						<a href="/register" className="home-links register">Register as a Reseller</a>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;