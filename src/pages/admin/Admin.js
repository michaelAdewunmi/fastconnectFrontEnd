import React, {Component} from 'react';
import { withAuth } from '@okta/okta-react';

import moment from 'moment'

import Header from '../../sharedComponents/Header';
import '../../styles/admin.css';
import PageLoadingModal from '../../sharedComponents/loadingModal';


class AdminPage extends Component {
	state = {
		authenticated: null, user: {given_name: 'me', name: 'meme'}, loading: true, admin: null,
		pendingOrders: null, allNetworkPrices: null, allNetworkVolumes: null, allOrders: null, inputVal: null, inputVol: null
	}

	dataInfoRef = React.createRef();

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
			this.checkAdmin()
		}
	}

	checkAdmin() {
		fetch(`/api/checkAdmin/${this.state.user.sub}`, {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then( res => { 
			res.json()
			.then(adminCheck => {
				if(adminCheck.Admin===true) {
					this.setState({ admin: true });
					this.getAllpendingOrders();
					this.getAllOrders();
					this.getDataPrices();
				}else{
					this.setState({ admin: false })
				}
			})
		}).catch(err => console.log('Sorry! Could not get orders'));
	}

	getAllpendingOrders = () => {
		fetch('/api/admin/transactions/pendingorders', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then( res => { 
			res.json()
			.then(pendingorders => {
				this.setState({ pendingOrders: pendingorders });
			})
		}).catch(err => console.log('Sorry! Could not get orders'));
	}

	getAllOrders = () => {
		fetch('/api/admin/transactions/allorders', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then( res => { 
			res.json()
			.then(allorders => {
				this.setState({ allOrders: allorders, loading:false });
			})
		}).catch(err => console.log('Sorry! Could not get orders'));
	}


	getDataPrices = () => {
		fetch('api/admin/getallnetworkprices', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then( res => { 
			res.json()
			.then(allPricesAndVol => {
				this.setState({ allNetworkPrices: allPricesAndVol.dataPrices, allNetworkVolumes:allPricesAndVol.dataVolumes });
			})
		}).catch(err => console.log('Sorry! Could not get orders'));
	}

	outputVars = (input, extraClass) => {
		var volVariations = []
		var varOutputs = []
		Object.entries(input).forEach(([key,value]) => {
			if(key !=='id' & key !=='network' && value !== 0) {
				volVariations.push(key)
			}
		})
		if(volVariations.length!==0){
			volVariations.forEach((singleval, i) => {
				var varOutput = singleval.charAt(0).toUpperCase() + singleval.slice(1).replace(/_/g, ' ').replace('gig', 'Gigabytes')
				varOutputs.push(<p key={i} className={`data-info`}>{varOutput}</p>)
			})
		}
		return varOutputs
	}

	outputVolumes = (input, extraClass, changeVal) => {
		var me=[]
		Object.entries(input).forEach(([key,value]) => {
			if(key !=='id' & key !=='network' && value !=='unassigned' && value !==0) {
				me.push(
					<div ref={this.dataInfoRef} className='editable-div' key={value}>
						<p onClick={this.editDataInfo} className={`data-info ${extraClass}`}>{value}</p>
						<input  onBlur={this.onInputFocusOut} className='hidden-input' defaultValue={value} onChange={changeVal} />
					</div>
				);
			}
		})
		return me;
	}

	onInputFocusOut = (e) => {
		e.currentTarget.parentNode.classList.remove('show-input')
	}

	changeDataVolumeVal = (e) => {
		this.setState({ inputVal: e.target.value })
	}

	changeDataVolumePrice = (e) => {
		this.setState({ inputVol: e.target.value })
	}

	editDataInfo = (e) => {
		e.currentTarget.parentNode.classList.add('show-input');
		e.currentTarget.nextElementSibling.focus();
	}

	approveOrder = (e) => {
		fetch(`/api/admin/transactions/approveorder/${e.target.dataset.id}`, {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then( res => { 
			res.json()
			.then(data => {
				this.getAllpendingOrders();
			})
		}).catch(err => console.log('Sorry! Could not get orders'));
	}

	logout = () => {
		this.props.auth.logout('/');
		this.props.history.push('/');
	}

	render() {
		const { authenticated, loading, admin, allNetworkVolumes, allNetworkPrices } = this.state;
		if(authenticated === null || authenticated === false) return <PageLoadingModal loading={loading} preferredLoadingWords='we check your account'/>;
		if(admin===null) return <PageLoadingModal loading={true} preferredLoadingWords='we check Administrator status'/>;
		if(admin!==null && admin!==true) return <div style={{height: '100vh', padding: '60px', width: 'calc(100% - 120px)'}} className='content-div page-wrapper'><h2>Sorry! You do not have the right to Access this page</h2></div>;
		const { user, user: { given_name } } = this.state
		const { pendingOrders, allOrders } = this.state;
		const getPendingOrders = () => {
			const orderOutput = [];
			if(pendingOrders !==null) {
				if(pendingOrders.length>0) {
					orderOutput.push(<h2 key='no-pending-order' className='admin-heading'>You have {(pendingOrders!==null && pendingOrders.length)} Data Request Pending</h2>);
					pendingOrders.forEach(order => {
						orderOutput.push(
							<div key={order.id} className='order'>
								<p>{order.fullname} is waiting for approval of {order.itemvolume} {order.itemnetwork} Data!</p>
								<input onClick={this.approveOrder} data-id={order.id} className='btn ver-1 admin-btn' type='button' value='Approve!' /> 
							</div>
						);
					})
				}else if(pendingOrders.length === 0){
					orderOutput.push(<h2 className='admin-heading no-content' key='none'>You Presently have No pending Data Requests</h2>)
				}
			}
			return orderOutput;
		}
		const outputAllOrders = () => {
			const outputOrders = [];

			if(allOrders !==null) {
				
				if(allOrders.length>0) {
					outputOrders.push(<h2 className='admin-heading' key='order-heading'>Below are all Your last 30 Orders</h2>);
					allOrders.forEach(singleorder => {
						outputOrders.push(
							<div key={singleorder.id} className='order'>
								<p>{singleorder.fullname} bought {singleorder.itemvolume} {singleorder.itemnetwork} Data {moment(singleorder.trnzctndate).fromNow()}!</p>
							</div>
						);
					})
				}else if(allOrders.length === 0 ){
					outputOrders.push(<h2 className='admin-heading no-content' key='no-pending-order'>You have No Purchase Transaction</h2>)
				}
			}
			return outputOrders;
		}
		return(
			<div className='content-div page-wrapper'>
				<PageLoadingModal loading={loading} preferredLoadingWords='we get all Transactions'/>;
				<Header 
					pageBodyWrapper='page-body' username={user && given_name} fullName={user && user.name} 
					firstNameFirstChar={user && given_name.slice(0, 1)} logoutFunc={this.logout}
				/>
				<div className='user-info page-body admin-content-wrapper'>
					<div className='admin-card card pending-orders'>
						{getPendingOrders()}
					</div>
					<hr />
					<div className='admin-card card all-orders' style={{marginTop: '30px'}}>
						{outputAllOrders()}
					</div>
					<div>
						<div className='network-data-wrapper card'>
							<h2 className='network-info-heading mtn-head'>MTN Data Info</h2>
							<div className='info-holder'>{allNetworkPrices && this.outputVars(allNetworkPrices[0], 'mtn')}</div>
							<div className='info-holder'>{allNetworkVolumes && this.outputVolumes(allNetworkVolumes[0], 'mtn', this.changeDataVolumeVal)}</div>
							<div className='info-holder'>{allNetworkPrices && this.outputVolumes(allNetworkPrices[0], 'mtn', this.changeDataVolumePrice)}</div>
						</div>
						<div className='network-data-wrapper card'>
							<h2 className='network-info-heading airtel-head'>Airtel Data Info</h2>
							<div className='info-holder'>{allNetworkPrices && this.outputVars(allNetworkPrices[1],'airtel')}</div>
							<div className='info-holder'>{allNetworkVolumes && this.outputVolumes(allNetworkVolumes[1], 'airtel')}</div>
							<div className='info-holder'>{allNetworkPrices && this.outputVolumes(allNetworkPrices[1], 'airtel')}</div>
						</div>
						<div className='network-data-wrapper card'>
							<h2 className='network-info-heading glo-info'>GLO Data Info</h2>
							<div className='info-holder'>{allNetworkPrices && this.outputVars(allNetworkPrices[2],'glo')}</div>
							<div className='info-holder'>{allNetworkVolumes && this.outputVolumes(allNetworkVolumes[2], 'glo')}</div>
							<div className='info-holder'>{allNetworkPrices && this.outputVolumes(allNetworkPrices[2], 'glo')}</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withAuth(AdminPage);