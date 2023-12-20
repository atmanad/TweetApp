import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { notificationActions } from '../store/notification-slice';

function Notification({ type, message }) {
    const dispatch = useDispatch();
    const notification = useSelector(state => state.notification.notification);
    const handleClose = () => {
        dispatch(notificationActions.showNotification({
            open:false
        }))
    }
    return (
        <>
            {
                notification.open && <Alert onClose={handleClose} variant={type}>{message}</Alert>
            }
        </>
    )
}
export default Notification;