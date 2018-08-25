import React from 'react';

const TransactionActivity = ({ transactionHeading, bodyCopy, date, tranzctnstatus, paragraphClass, }) => {
	return (
		<div className="rows-wrapper flex">
			<div className="acct acct-id">
				<span className="tiny-head">{transactionHeading}</span>
				<p>{bodyCopy}</p>
			</div>
			<div className="acct acct-id">
				<span className="tiny-head">Payment Date</span>
				<p>{date}</p>
			</div>
			<div className="acct acct-id">
				<span className="tiny-head">Payment Status</span>
				<p className={paragraphClass}>{tranzctnstatus}</p>
			</div>
		</div>
	)
}

export default TransactionActivity;

