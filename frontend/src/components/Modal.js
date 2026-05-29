import React from 'react';

export const Modal = ({ open, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="alert-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="alert-popup" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
