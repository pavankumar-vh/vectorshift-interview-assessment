import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import {
  apiCreateShare, apiGetPipeline, apiGetRuns, apiRunPipeline,
  apiUpdatePipeline, apiValidatePipeline,
} from '../api/client';
import { PipelineToolbar } from '../toolbar';
import { PipelineUI } from '../ui';
import { useStore } from '../store';
import ShareDialog from '../components/ShareDialog';

export const PipelineEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { nodes, edges, setPipeline, resetPipeline } = useStore(
    (s) => ({ nodes: s.nodes, edges: s.edges, setPipeline: s.setPipeline, resetPipeline: s.resetPipeline }),
    shallow
  );

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [validation, setValidation] = useState(null);
  const [runs, setRuns] = useState([]);
  const [shareToken, setShareToken] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [running, setRunning] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const shareUrl = useMemo(() => shareToken ? `${window.location.origin}/share/${shareToken}` : '', [shareToken]);

  const flash = (msg) => { setStatus(msg); setTimeout(() => setStatus(''), 3000); };

  useEffect(() => {
    let ok = true;
    const go = async () => {
      setLoading(true); setError('');
      try {
        const p = await apiGetPipeline(id);
        if (!ok) return;
        setName(p.name); setDesc(p.description || '');
        setPipeline(p.nodes || [], p.edges || []);
        const r = await apiGetRuns(id);
        if (ok) setRuns(r.runs || []);
      } catch (e) { if (ok) setError(e.message || 'Unable to load pipeline'); }
      finally { if (ok) setLoading(false); }
    };
    go();
    return () => { ok = false; resetPipeline(); };
  }, [id, setPipeline, resetPipeline]);

  const save = async () => {
    setSaving(true); setError('');
    try { await apiUpdatePipeline(id, { name: name.trim() || 'Untitled', description: desc.trim(), nodes, edges }); flash('Saved'); }
    catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const validate = async () => {
    setValidating(true); setError('');
    try { const r = await apiValidatePipeline(nodes, edges); setValidation(r); flash('Validation complete'); }
    catch (e) { setError(e.message); } finally { setValidating(false); }
  };

  const run = async () => {
    setRunning(true); setError('');
    try { await apiRunPipeline(id); const r = await apiGetRuns(id); setRuns(r.runs || []); flash('Run recorded'); }
    catch (e) { setError(e.message); } finally { setRunning(false); }
  };

  const share = async () => {
    setSharing(true); setError('');
    try {
      await apiUpdatePipeline(id, { name: name.trim() || 'Untitled', description: desc.trim(), nodes, edges });
      const d = await apiCreateShare(id);
      setShareToken(d.token);
      setShowShare(true);
    } catch (e) { setError(e.message); } finally { setSharing(false); }
  };

  const openShareDialog = () => {
    if (shareUrl) setShowShare(true);
  };

  if (loading) return <div className="loading-state"><div className="loading-card"><span className="spinner" /> Loading pipeline...</div></div>;

  return (
    <>
      <div className="page">
        <div className="page-header">
          <div>
            <div className="editor-breadcrumb">
              <Link to="/pipelines">Pipelines</Link>
              <span className="editor-breadcrumb-sep">/</span>
              <span style={{ color: 'var(--text)' }}>{name || 'Untitled'}</span>
            </div>
          </div>
          <div className="page-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/pipelines')}>&larr; Back</button>
            <div className="page-actions-divider" />
            <button className="btn btn-outline" onClick={validate} disabled={validating}>
              {validating ? <><span className="spinner" /> Checking</> : 'Validate'}
            </button>
            <button className="btn btn-secondary" onClick={save} disabled={saving}>
              {saving ? <><span className="spinner" /> Saving</> : 'Save'}
              <kbd className="kbd">&#8984;S</kbd>
            </button>
            <button className="btn btn-primary" onClick={run} disabled={running}>
              {running ? <><span className="spinner" /> Running</> : 'Run'}
            </button>
            <button className="btn btn-ghost" onClick={share} disabled={sharing}>
              {sharing ? <span className="spinner" /> : 'Share'}
            </button>
          </div>
        </div>

        {status && <div className="banner banner-success animate-in">{status}</div>}
        {error && <div className="banner banner-error animate-in">{error}</div>}

        <div className="editor-layout">
          <div className="editor-main">
            <div className="editor-meta">
              <label className="form-field">
                <span>Name</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Pipeline name" />
              </label>
              <div className="editor-meta-sep" />
              <label className="form-field">
                <span>Desc</span>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" />
              </label>
            </div>
            <PipelineToolbar />
            <PipelineUI />
          </div>

          <aside className="editor-side">
            <section className="panel">
              <div className="panel-header">
                <div><div className="panel-title">Canvas</div></div>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{nodes.length}N · {edges.length}E</span>
              </div>
              {validation ? (
                <div className="validation-grid">
                  <div className="validation-row">
                    <div className="validation-stat"><div className="validation-label">Nodes</div><div className="validation-value">{validation.num_nodes}</div></div>
                    <div className="validation-stat"><div className="validation-label">Edges</div><div className="validation-value">{validation.num_edges}</div></div>
                  </div>
                  <div className="validation-status" data-status={validation.is_dag ? 'ok' : 'warn'}>
                    <span className="validation-status-dot" />
                    {validation.is_dag ? 'Valid DAG' : 'Cycle detected'}
                  </div>
                </div>
              ) : (
                <div className="panel-empty">
                  <span style={{ fontSize: 11 }}>Click Validate to check</span>
                </div>
              )}
            </section>

            <section className="panel">
              <div className="panel-header"><div><div className="panel-title">Share</div></div></div>
              {shareUrl ? (
                <div className="share-panel">
                  <div className="share-url" style={{ fontSize: 10 }}>{shareUrl}</div>
                  <button className="btn btn-sm btn-outline" style={{ width: '100%' }} onClick={openShareDialog}>View link</button>
                </div>
              ) : (
                <div className="panel-empty">
                  <span style={{ fontSize: 11 }}>Click Share to generate a link</span>
                </div>
              )}
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">Runs</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{runs.length}</span>
              </div>
              {runs.length === 0 ? (
                <div className="panel-empty">
                  <span style={{ fontSize: 11 }}>No runs yet</span>
                </div>
              ) : (
                <div className="run-list">
                  {runs.map((r) => (
                    <div key={r.id} className="run-item">
                      <div>
                        <div className="run-title">#{r.id}</div>
                        <div className="run-meta">{new Date(r.created_at).toLocaleString()}</div>
                      </div>
                      <div className="run-status" data-status={r.result?.is_dag ? 'ok' : 'warn'}>
                        <span className="run-status-dot" />
                        {r.result?.is_dag ? 'OK' : '!'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
      <ShareDialog open={showShare} shareUrl={shareUrl} onClose={() => setShowShare(false)} />
    </>
  );
};
