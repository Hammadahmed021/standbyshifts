import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from './Modal';
import { clearNotification } from '../store/notificationSlice';
import { Link, useLocation } from 'react-router-dom';

const NotificationModal = () => {
  const dispatch = useDispatch();
  const { message, visible } = useSelector((state) => state.notification);
  const location = useLocation();

  const handleClose = () => {
    dispatch(clearNotification());
  };

  useEffect(() => {
    // Clear notification when navigating away from the page
    return () => {
      dispatch(clearNotification());
    };
  }, [location, dispatch]);

  return (
    visible && (
      <Modal
        title={
          <>
            <p className='text-base'>{message}</p>
            <Link to="/profile" className="text-tn_pink text-base underline">Go to Profile</Link>
          </>
        }
        onClose={handleClose}
      />
    )
  );
};

export default NotificationModal;
