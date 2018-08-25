import React from 'react';

const AcctActivityTop = ({ acctBalance, AcctId,paymentcount, purchasecount }) => {
	return(
		<div>
			<div className="card-section-head flex padded">
				<div style={{marginLeft: "0"}} className="profile-heading-wrapper">
					<h3 className="profile"style={{alignSelf: "center"}}>My Account Status</h3>
					<span style={{marginTop: "4px", fontWeight: "300"}}>Account status and information</span>
				</div>
			</div>
			<hr />
			<div className="rows-wrapper flex">
				<div className="acct acct-id">
					<span className="tiny-head">FastConnect Account Id</span>
					<p>{AcctId}</p>
				</div>
				<div className="acct acct-status">
					<span className="tiny-head">Account Status</span>
					<p>Active</p>
				</div>
				<div className="acct acct-wallet">
					<span className="tiny-head">Acocunt Balance</span>
					<p>{acctBalance}</p>
				</div>
				<div className="acct  add-funds">
					<a href="/makepayment" className="payment-link">Add more Funds</a>
				</div>
			</div>
			<hr />
			<div className="card-section-head flex padded" style={{paddingTop: "15px"}}>
				<div style={{marginLeft: "0"}} className="profile-heading-wrapper">
					<h3 className="profile"style={{alignSelf: "center"}}>Transactions Count</h3>
					<span style={{marginTop: "4px", fontWeight: "300"}}>Below are the Number of transactions done</span>
				</div>
			</div>
			<div className="rows-wrapper flex">
				<div className="acct acct-status">
					<span className="tiny-head">Payments Count</span>
					<p>{paymentcount}</p>
				</div>
				<div className="acct acct-wallet">
					<span className="tiny-head">Purchases Count</span>
					<p>{purchasecount}</p>
				</div>
				<div className="acct acct-wallet">
					<span className="tiny-head">Last Transaction</span>
					<p>28-04-2018</p>
				</div>
				<div className="acct  add-funds">
					<a href="/buydata" className="payment-link">Buy Data Now</a>
				</div>
			</div>
			<hr />
			<div className="security-information padded">
				<em>Thank you for your Patronage! In case of any suspicious transaction or 
				wrong account information, Please Contact us Asap at 081553348595</em>
			</div>
		</div>
	)
}

export default AcctActivityTop;