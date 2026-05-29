import React from 'react';
import Modal from './Modal';

export const ConfirmDialog = ({ open, title, message, onCancel, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'warn' }) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className={`alert-popup alert-popup--${variant}`}>
        {title ? <h3>{title}</h3> : null}
        {message ? <p>{message}</p> : null}
        <div className="alert-actions">
          <button className="btn btn-outline" onClick={onCancel}>{cancelText}</button>
          <button className="btn btn-primary" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
