import React, {Component} from 'react';

class EditableDiv extends Component {
	editLabel=React.createRef();
	editInfo = () => {
		const profileDivs = document.querySelectorAll(".detail-section");
		const userprofileParent = document.querySelector("#user-profile-info");
		profileDivs.forEach( profileDiv => {
			profileDiv.classList.add("getit");
		})
		userprofileParent.classList.add("editing");
	}

	render() {
		return(
			<div className={`info-wrapper ${extraClass_Content}`}>
				<label ref={this.editLabel}>{infoLabel[0]}</label>
				<input className="edit-profile full-width-type" type="text" value={InputOptionVal[0]} onChange={InputOnchangeFunc[0]} />
				<hr className="info-hr" />
				<hr className="info-hr hidden" />
			</div>
		)
	}
}