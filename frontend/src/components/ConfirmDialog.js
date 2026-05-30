import Modal from './Modal';

export const ConfirmDialog = ({ open, title, message, onCancel, onConfirm, confirmText = 'Delete', cancelText = 'Cancel', variant = 'warn' }) => (
  <Modal open={open} onClose={onCancel}>
    <div className={`alert-popup alert-popup--${variant}`}>
      {title && <h3>{title}</h3>}
      {message && <p>{message}</p>}
      <div className="alert-actions">
        <button className="btn btn-outline" onClick={onCancel}>{cancelText}</button>
        <button className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
