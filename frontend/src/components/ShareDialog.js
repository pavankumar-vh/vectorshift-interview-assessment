import { useState, useCallback } from 'react';
import Modal from './Modal';

export const ShareDialog = ({ open, shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select text in input
      const el = document.getElementById('share-url-input');
      if (el) { el.select(); document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    }
  }, [shareUrl]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="share-dialog">
        <div className="share-dialog-header">
          <div className="share-dialog-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </div>
          <div>
            <h3>Share pipeline</h3>
            <p>Anyone with this link can view the pipeline in read-only mode.</p>
          </div>
        </div>
        <div className="share-dialog-url-row">
          <input
            id="share-url-input"
            className="share-dialog-url"
            type="text"
            value={shareUrl}
            readOnly
            onClick={(e) => e.target.select()}
          />
          <button className={`btn ${copied ? 'btn-teal' : 'btn-primary'}`} onClick={handleCopy}>
            {copied ? (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
            )}
          </button>
        </div>
        <div className="share-dialog-footer">
          <button className="btn btn-ghost" onClick={onClose}>Done</button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareDialog;
