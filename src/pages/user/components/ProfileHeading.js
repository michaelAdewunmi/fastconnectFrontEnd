import React from 'react';

const ProfileHeading = ({ imagePlaceholder }) => {
	return(
		<div className="card-section-head flex padded">
			<div className="profile-image card-section"><span className="prof-image-placeholder">{imagePlaceholder}</span></div>
			<div className="profile-heading-wrapper">
				<h3 className="profile"style={{alignSelf: "center"}}>My Profile</h3>
				<span>FastConnect Reseller</span>
			</div>
		</div>
	)
}

export default ProfileHeading;