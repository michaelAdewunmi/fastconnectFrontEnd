import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import Header from '../../sharedComponents/Header';
import SelectInput from '../../sharedComponents/SelectInput';
import Input from '../../sharedComponents/Input';
import PageLoadingModal from '../../sharedComponents/loadingModal';

import '../../styles/datapurchase.css';

class DataRequest extends Component {

	state = {
		authenticated: null, user: null, oktawallet: null, purchaseCount: null, networkId: null,
		purchasingNetwork: null, purchasingVolume: '', purchasingAmount: '', recipient: '',
		NetworkPrices: '', NetworkVolumes: '', userWallet: '', purchaseRes: null, walletError: null,
		loading: false
	}

	networkRef = React.createRef();
	volumeRef = React.createRef();

	componentDidMount() {
		this.checkAuthentication()
	}

	componentDidUpdate() {
		this.checkAuthentication()
	}


	async checkAuthentication() {
		const authenticated = await this.props.auth.isAuthenticated();
		if(authenticated !== this.state.authenticated && authenticated !== false) {
			const user = await this.props.auth.getUser();
			this.setState({ authenticated, user });
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
				this.setState({ oktawallet: data.profile.wallet, purchaseCount: data.profile.purchasecount });
			})
		}).catch(err => console.log('Sorry! Could not get user'));
	}

	onAmountChange = (e) => {
		this.setState({ amount: Number(e.target.value)});
	}

	onPhoneNumberChange = (e) => {
		this.setState({ recipient: e.target.value});
	}

	onPurchasedItemNameChange = (e) => {
		this.setState({ purchasing: e.target.value});
	}

	getPrices = () => {
		const { networkId } = this.state;
		const id = {
			id: Number(networkId)
		}
		fetch('/api/user/transactionprices', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(id)
		}).then(res => {
			res.json().then(data => {
				this.setState({ NetworkPrices: data[0], NetworkVolumes: data[1] });
			})
		});
	}

	purchaseChange = (e) => {
		const info = e.target.value
		const newInfo = info.split(",")
		this.setState({ purchasingVolume: newInfo[0], purchasingAmount: newInfo[1], })
	}


	handleSubmit = (e) => {
		e.preventDefault();
		const { user: { sub, email }, oktawallet, purchaseCount, purchasingAmount, purchasingNetwork, purchasingVolume, recipient, purchaseRes } = this.state
		if( !purchasingAmount || !purchasingNetwork || !purchasingVolume || !recipient) return;
		const transactionDetails = {
			id: sub,
			email: email,
			oktawallet: oktawallet,
			amount: Number(purchasingAmount),
			network: purchasingNetwork,
			volume: purchasingVolume,
			recipient: recipient,
			purchaseCount: purchaseCount
		}
		this.setState({ loading: true})
		fetch('/api/user/storepurchases', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(transactionDetails)
		}).then( res => {
			res.json().then(data=> {
				this.setState({ purchaseRes: data })
				if(purchaseRes && (purchaseRes.status==="success")){
					this.setState({ loading: false})
				}
			});
		});
	}

	pickOption = (e) => {
		this.setState({ purchasingNetwork: null, purchasingVolume: null })
		const selectedOptionVal = e.target.dataset.value
		this.setState({ purchasingNetwork: e.target.dataset.name })
		if(selectedOptionVal==="1" || selectedOptionVal==="2" || selectedOptionVal==="3") {
			const id = {
				id: Number(selectedOptionVal)
			}
			fetch('/api/user/transactionprices', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(id)
			}).then(res => {
				res.json().then(data => {
					this.setState({ NetworkPrices: data[0], NetworkVolumes: data[1] });
				})
			});
		}
		this.networkRef.current.optionsRef.current.blur();
	}

	pickVolume = (e) => {
		const amount = e.target.dataset.value;
		const selectedVolume = e.target.dataset.name.split("@")[0].trim();
		this.setState({ purchasingVolume: selectedVolume, purchasingAmount: amount });
		this.volumeRef.current.optionsRef.current.blur();
	}

	logout = () => {
		this.props.auth.logout('/');
		this.props.history.push('/');
	}


	render() {
		if(this.state.authenticated === null || this.state.authenticated === false) return null;
		const { user, user: { given_name, name }, purchasingVolume, NetworkPrices, NetworkVolumes, walletError, purchaseRes, purchasingNetwork, purchasingAmount, loading } = this.state
		if(purchaseRes && (purchaseRes.status==="Success")) {
			return (<div className='notification-div'>
						<div style={{maxWidth: '800px', margin: '0 auto'}}>
							<h1 className='notification-body'>Your request was successful! Data will be sent to recipient soon!</h1>
						</div>
						<a href='/user' className='btn var-1 var-2 href-link'>Take me Home</a>
					</div>)
		}
		const Lowwallet = () => {
				if(walletError!==null) {
				return <div>{walletError}. Please <a href="/buy">Recharge Now</a></div>
			}
		}
		var newObjectsArray = Object.keys(NetworkPrices).map((key) => {
			var newKey = NetworkVolumes[key] || key;
			return { [newKey] : NetworkPrices[key] };
		});
		const getVolumes = () => {
			var newest = [];
			if(newObjectsArray.length !== 0) {
				newObjectsArray.forEach((obj) => {
					Object.entries(obj).forEach(([key, value]) => {
						if(key!=="1 Month" && key!=="3 Months" && key!=="unassigned" && key !=="MTN"  && key !=="Airtel"  
							&& key !=="Glo" && key !=="1" && key !=="2" && key !=="3") {
							newest.push({[key+" @ "+value+"NGN"]: value});
						}
					})
				})
				var objectprop = newest.reduce((a,b) => Object.assign({}, a, b))
			}
			if(newest.length===0) {
				return <div id="selectwrapper"><p className="instruction" style={{margin: 0}} >Pick a Network Above, then Pick Volume Here</p></div>
			}else{
				return <SelectInput ref={this.volumeRef}
					optionsHeading={(purchasingVolume && (`${purchasingVolume} Data, Price: ${purchasingAmount}Naira`)) || 'Pick Data volume'} optionsData={objectprop} 
					headingOnclickFunc={this.showOptions} btnOnclickFunc={this.showOptions} onClickOption={this.pickVolume}
				/>
			}
		}
		return(
			<div id='page-wrapper'>
				<PageLoadingModal loading={loading} preferredLoadingWords='we process your request' />
				<Header pageBodyWrapper='page-body' username={user && given_name} fullName={user && name} firstNameFirstChar={user && given_name.slice(0, 1)} logoutFunc={this.logout} />
				<div className='page-body'>
					<p className="header-user-name mobile">Welcome Demilade!</p>
					{Lowwallet()}
					<form className='purchase-form' onSubmit={this.handleSubmit}>
						<SelectInput ref={this.networkRef}
							optionsHeading={purchasingNetwork || 'Pick the Network'} optionsData={{MTN: "1", Airtel: "2", Glo: "3"}} 
							headingOnclickFunc={this.showOptions} btnOnclickFunc={this.showOptions} onClickOption={this.pickOption}
						/>
						{getVolumes()}
						<Input labelFor="number" labelBody="Recipient's Phone Number (example 080334****)" onchangefunc={this.onPhoneNumberChange} onchangeVal={this.state.recipient} id="phone" type="text" inputClass="input" />
						<input id='transactionBtn' className='btn var-1' type='submit' value='Submit' />
					</form>
				</div>
			</div>
		)
	}
}

export default withAuth(DataRequest);