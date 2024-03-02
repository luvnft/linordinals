import { toast } from 'react-toastify';

function NotificationMessage({ header, message }) {
	return (
		<div className={`flex flex-col`}>
			<h3 className='text-sm font-medium'>{header}</h3>
			{message && <p className='text-xs'>{message}</p>}
		</div>
	);
}

const queueNotification = ({ header, message, duration = 5000, status }) => {
	const args = {
		autoClose: duration
	};

	if (status) {
		toast[status](
			<NotificationMessage
				header={header}
				message={message}
			/>,
			args
		);
		return;
	}

	toast(
		<NotificationMessage
			header={header}
			message={message}
		/>,
		args
	);
};

export default queueNotification;
