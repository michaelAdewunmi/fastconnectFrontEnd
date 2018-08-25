import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

class PageLoadingModal extends Component {
	modalRef = React.createRef();
	componentDidMount() {
		this.showModal()
	}
	componentDidUpdate() {
		this.showModal()
	}
	showModal = () => {
		if(this.props.loading===true) {
			this.modalRef.current.classList.add('show');
		}else{
			this.modalRef.current.classList.remove('show');
		}
	}

	render() {
		return(
			<div ref={this.modalRef} className='modal'>
				<div className='loader-wrapper'>
					<Loader type='TailSpin' color='#025583' height='100' width='100' />
					<p className='loading'>Loading...</p>
					<span className='loading'>Please Wait while {this.props.preferredLoadingWords}</span>
				</div>
			</div>
		)
	}
}

export default PageLoadingModal;