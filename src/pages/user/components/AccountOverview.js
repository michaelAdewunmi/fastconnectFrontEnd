import React from 'react';

const OverviewComponentBody = ({ icon, paragraphCopy, spanCopy, extraClass_Paragraph="" }) => {
	return(
		<div className="detail-section flex padded-sm overview">
			<div className="icon-holder"><img className="icon-large" src={icon} alt="fastconnectwallet" /></div>
			<div style={{marginLeft: "10px"}} className="profile-heading-wrapper overview-section">
				<p style={{alignSelf: "flex-start"}}>{paragraphCopy[0]} <span className={`info-complement ${extraClass_Paragraph}`}>{paragraphCopy[1]}</span></p>
				<span className="tiny-info">{spanCopy}</span>
			</div>
		</div>
	)
}

export default OverviewComponentBody;