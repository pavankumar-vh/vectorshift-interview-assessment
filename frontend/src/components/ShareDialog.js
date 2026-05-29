import React from 'react';
import Modal from './Modal';

export const ShareDialog = ({ open, shareUrl, onClose }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (e) {
      // ignore
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="alert-popup">
        <h3>Share link</h3>
        <p>Copy the share URL below to send to others.</p>
        <div style={{ marginBottom: 12 }}>
          <div className="share-url" style={{ padding: 8 }}>{shareUrl}</div>
        </div>
        <div className="alert-actions">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handleCopy}>Copy</button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareDialog;
