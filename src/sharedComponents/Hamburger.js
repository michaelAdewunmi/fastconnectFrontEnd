import React from 'react';




const Hamburger = ({ rotateVal_Top, rotateVal_Bottom, opacityVal_Middle, PositionValue_Top, PositionValue_Bottom, clickFunction }) => {

	// const Basestyles = {
	// 	// borderRadius: `10px`,
	// 	// width: `35px`,
	// 	// height: `2px`,
	// 	// background: `#fff`,
	// 	// display: `block`,
	// 	// transformOrigin: `center`,
	// 	// transform: `rotate(0deg)`,
	// 	// opacity: `1`,
	// 	// position: `relative`,
	// 	// top: `0px`,
	// 	// transition: `all .1s ease-in-out`,
	// };

	const topChangingStyles = {
		borderRadius: `10px`,
		width: `35px`,
		height: `2px`,
		background: `#fff`,
		display: `block`,
		transformOrigin: `center`,
		opacity: `1`,
		position: `relative`,
		transition: `all .1s cubic-bezier(1, -0.06, 0, 2.43)`,
		transform: `rotate(${ rotateVal_Top }deg)`,
		top: `${PositionValue_Top}px`,
	}

	const middleChangingStyles = {
		borderRadius: `10px`,
		width: `35px`,
		height: `2px`,
		background: `#fff`,
		display: `block`,
		transformOrigin: `center`,
		transform: `rotate(0deg)`,
		position: `relative`,
		top: `0px`,
		transition: `all .1s cubic-bezier(1, -0.06, 0, 2.43)`,
		opacity: `${opacityVal_Middle}`,
	}

	const bottomChangingStyles = {
		borderRadius: `10px`,
		width: `35px`,
		height: `2px`,
		background: `#fff`,
		display: `block`,
		transformOrigin: `center`,
		opacity: `1`,
		position: `relative`,
		transition: `all .1s cubic-bezier(1, -0.06, 0, 2.43)`,
		transform: `rotate(${ rotateVal_Bottom }deg)`,
		top: `${PositionValue_Bottom}px`,
	}

	return (
		<div className='hamburger-holder' onClick={clickFunction}>
			<span className="hamburger" style={topChangingStyles}></span>
			<span className="hamburger" style={middleChangingStyles}></span>
			<span className="hamburger" style={bottomChangingStyles}></span>
		</div>
	);
}

export default Hamburger;