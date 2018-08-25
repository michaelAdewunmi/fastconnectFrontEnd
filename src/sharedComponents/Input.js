import React, { Component } from 'react';



class Input extends Component {
	myInput = React.createRef();
	myLabel = React.createRef();

	focusFunction = (e) => {
		const label = this.myLabel.current
		label.classList.add('busy-input');
	}

	blurFunction = (e) => {
		const theInput = this.myInput.current;
		const label = this.myLabel.current;
		if(theInput.value) {
			return
		}else{
			label.classList.remove('busy-input');
		}
	}


	render() {
		const { labelFor, labelBody, onchangefunc, id, type, inputClass, onchangeVal, icon='' } = this.props;
		return(
			<div className='holder' id='input-wrapper'>
				{icon}<label ref={this.myLabel} className='label-gen' htmlFor={labelFor}>{labelBody}</label>
				<input ref={this.myInput} onBlur={this.blurFunction} onFocus={this.focusFunction} onChange={onchangefunc} id={id} type={type} value={onchangeVal} className={`input-gen ${inputClass}`} />
				<hr className='line' />
				<hr className='line top' />
			</div>
		)
	}
}

export default Input