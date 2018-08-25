import React from 'react';

const InputField = ({ inputType, inputName, onChangeFunc, placeholder, spanExtraClass, localIcon='' }) => {
	return(
		<div className="o-form-fieldset o-form-label-top">
			<div className="o-form-input">
				<span className="o-form-input-name-username o-form-control okta-form-input-field input-fix">
					<span className={`icon input-icon ${spanExtraClass}`}>{localIcon}</span>
					<input type={inputType} name={inputName} onChange={onChangeFunc} placeholder={placeholder} />
				</span>
			</div>
		</div>
	)
}

export default InputField;