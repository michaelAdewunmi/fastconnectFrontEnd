import React, {Component} from 'react';

import '../styles/sharedComponentsStyles/selectInput.css';

class SelectInput extends Component {
	state = { options: '', instruction: null, selectedVal: null	}
	optionsController = React.createRef()
	optionsRef = React.createRef()

	displayOptions = () => {
		this.setState( { options: null } );
		var output = [];
		Object.entries(this.props.optionsData).forEach(
		([key, value]) => {
			output.push(<div onClick={this.props.onClickOption} key={key} data-name={key} data-value={value} className="options">{key}</div>);
		});
		this.setState( { options: output } );
		this.optionsController.current.classList.add('open');
		this.optionsRef.current.focus();
		return;
	}
	closeOptions = () => {
		this.optionsController.current.classList.remove('open');
	}
	render() {
		const { optionsHeading } = this.props;
		return(
			<div ref={this.optionsController} className="closed" id="selectwrapper">
				<span className="instruction" onClick={this.displayOptions}>{optionsHeading}</span>
				<div id='selected'></div>
				<p id="button" className="btn" onClick={this.displayOptions}><span>v</span></p>
				<div ref={this.optionsRef} onBlur={this.closeOptions} className="options-holder" id="optionsHolder" tabIndex="1">
					{this.state.options}
				</div>
				<hr className="line" />
			</div>
		)
	}
}

export default SelectInput;