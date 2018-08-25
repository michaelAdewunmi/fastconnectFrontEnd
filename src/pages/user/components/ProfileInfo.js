import React from 'react';


const UserProfileInfo = ({ infoLabel, InputOptionVal, InputOnchangeFunc, extraClass_Wrapper="", extraClass_Content="" }) => {
	return (
		<div className={`detail-section flex padded ${extraClass_Wrapper}`}>
			<div className={`info-wrapper ${extraClass_Content}`}>
				<label>{infoLabel[0]}</label>
				<input className="edit-profile full-width-type" type="text" value={InputOptionVal[0]} onChange={InputOnchangeFunc[0]} />
				<hr className="info-hr" />
				<hr className="info-hr hidden" />
			</div>

			{
				infoLabel[1] 
					&&
				<div className={`info-wrapper ${extraClass_Content}`}>
					<label>{infoLabel[1]}</label>
					<input className="edit-profile full-width-type" type="text" value={InputOptionVal[1]} onChange={InputOnchangeFunc[1]} />
					<hr className="info-hr" />
					<hr className="info-hr hidden" />
				</div>
			}
			
		</div>
	)
}

export default UserProfileInfo;