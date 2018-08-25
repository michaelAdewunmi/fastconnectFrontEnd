import React from 'react';

const HistoryHeading = ({ historyType }) => {
	return (
		<div className="card-section-head flex padded">
			<div style={{marginLeft: "0"}} className="profile-heading-wrapper">
				<h3 className="profile"style={{alignSelf: "center"}}>Transactions history - {historyType}</h3>
				<span style={{marginTop: "4px"}}>A History of last 30 {historyType}</span>
			</div>
		</div>
	)
}

export default HistoryHeading;