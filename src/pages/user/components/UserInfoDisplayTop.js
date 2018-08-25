import React from 'react';


const UserInfoTop = ({ heading, displayInfo, infoComplement, extraClassName='' }) => {
	return (
		<div className="card top-cards">
			<h3 className="profile top-head">{heading}</h3>
			<p className={`top-span ${extraClassName}`}>{displayInfo}<span className="complement"> {infoComplement}</span></p>
		</div>
	);
}

export default UserInfoTop;