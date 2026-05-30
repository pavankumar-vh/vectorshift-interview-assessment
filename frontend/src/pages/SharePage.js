import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetSharedPipeline } from '../api/client';
import { PipelineUI } from '../ui';
import { useStore } from '../store';
import { useTheme } from '../theme/ThemeContext';
import { shallow } from 'zustand/shallow';

export const SharePage = () => {
  const { token } = useParams();
  const { theme, toggleTheme } = useTheme();
  const { setPipeline, resetPipeline } = useStore((s) => ({ setPipeline: s.setPipeline, resetPipeline: s.resetPipeline }), shallow);
  const [pipeline, setPipelineState] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    const go = async () => {
      setLoading(true); setError('');
      try {
        const d = await apiGetSharedPipeline(token);
        if (!ok) return;
        setPipelineState(d); setPipeline(d.nodes || [], d.edges || []);
      } catch (e) { if (ok) setError(e.message || 'Unable to load shared pipeline'); }
      finally { if (ok) setLoading(false); }
    };
    go();
    return () => { ok = false; resetPipeline(); };
  }, [token, setPipeline, resetPipeline]);

  if (loading) return (
    <div className="loading-state">
      <div className="loading-card"><span className="spinner" /> Loading shared pipeline...</div>
    </div>
  );

  if (error) return (
    <div className="share-page">
      <div className="share-error-card">
        <div className="share-error-code">Link expired or invalid</div>
        <p>{error}</p>
        <a className="btn btn-outline" href="/">Go to VectorShift</a>
      </div>
    </div>
  );

  return (
    <div className="share-page">
      <div className="share-topbar">
        <div className="share-topbar-brand">
          <div className="topnav-logo-mark">V</div>
          <span>VectorShift</span>
        </div>
        <button className="topnav-theme-btn" type="button" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
      </div>

      <div className="share-header">
        <div>
          <div className="share-kicker">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            Shared pipeline
          </div>
          <div className="share-title">{pipeline?.name}</div>
          {pipeline?.description && <div className="share-subtitle">{pipeline.description}</div>}
        </div>
        <div className="share-meta-row">
          <div className="share-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Read only
          </div>
          {pipeline?.num_nodes !== undefined && (
            <span className="share-stat">{pipeline.num_nodes} nodes · {pipeline.num_edges} edges</span>
          )}
        </div>
      </div>
      <PipelineUI readOnly />
    </div>
  );
};
