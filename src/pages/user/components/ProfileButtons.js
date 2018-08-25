import React from 'react';

const ProfileButtons = ({ editBtnClickFunc, cancelBtnClickFunc, saveBtnClickFunc }) => {
	return(
		<div className="btn-wrapper padded">
			<input onClick={editBtnClickFunc} className="edit-btn profile-btn" type="submit" value="Edit Profile" />
			<div id="saveandcancel" className="save-and-cancel-btns-wrapper">
				<input onClick={cancelBtnClickFunc} className="edit-btn profile-btn cancel" type="submit" value="Cancel" />
				<input onClick={saveBtnClickFunc} className="edit-btn profile-btn save" type="submit" value="Save Edit" />
			</div>
		</div>
	)
}

export default ProfileButtons;