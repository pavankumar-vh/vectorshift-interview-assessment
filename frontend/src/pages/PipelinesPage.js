import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCreatePipeline, apiDeletePipeline, apiListPipelines } from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';

const timeAgo = (d) => {
  const ms = Date.now() - new Date(d).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

export const PipelinesPage = () => {
  const navigate = useNavigate();
  const [pipelines, setPipelines] = useState([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMeta, setConfirmMeta] = useState({ id: null, name: '' });
  const [error, setError] = useState('');

  const load = async (q = '') => {
    setLoading(true); setError('');
    try { const r = await apiListPipelines(q); setPipelines(r.pipelines || []); }
    catch (e) { setError(e.message || 'Unable to load pipelines'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => { e.preventDefault(); load(search); };

  const handleCreate = async (e) => {
    e.preventDefault(); setCreating(true); setError('');
    try {
      const p = await apiCreatePipeline({ name: name.trim() || 'Untitled Pipeline', description: desc.trim(), nodes: [], edges: [] });
      navigate(`/pipelines/${p.id}`);
    } catch (e) { setError(e.message || 'Unable to create'); }
    finally { setCreating(false); }
  };

  const askDelete = (id, n) => { setConfirmMeta({ id, name: n }); setConfirmOpen(true); };

  const doDelete = async () => {
    setDeletingId(confirmMeta.id); setError(''); setConfirmOpen(false);
    try { await apiDeletePipeline(confirmMeta.id); await load(search); }
    catch (e) { setError(e.message || 'Unable to delete'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pipelines</h1>
          <p className="page-subtitle">Manage and share your pipeline library</p>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <button className="btn btn-outline" type="submit">Search</button>
        </form>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      <div className="page-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">New pipeline</div>
              <div className="panel-subtitle">Give it a name, then build in the editor</div>
            </div>
          </div>
          <form className="panel-form" onSubmit={handleCreate}>
            <label className="form-field">
              <span>Name</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Onboarding flow" />
            </label>
            <label className="form-field">
              <span>Description</span>
              <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What does this pipeline do?" />
            </label>
            <button className="btn btn-primary" type="submit" disabled={creating}>
              {creating ? <><span className="spinner" /> Creating...</> : 'Create pipeline'}
            </button>
          </form>
        </section>

        <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '16px 20px', margin: 0 }}>
            <div>
              <div className="panel-title">Recent</div>
              <div className="panel-subtitle">{pipelines.length} pipeline{pipelines.length === 1 ? '' : 's'}</div>
            </div>
          </div>
          {loading ? (
            <div className="panel-empty"><span className="spinner" /> Loading...</div>
          ) : pipelines.length === 0 ? (
            <div className="panel-empty">No pipelines yet</div>
          ) : (
            <div className="pipeline-list">
              {pipelines.map((p) => (
                <div key={p.id} className="pipeline-card">
                  <div className="pipeline-card-content">
                    <div className="pipeline-card-title">{p.name}</div>
                    <div className="pipeline-card-meta">{p.description || 'No description'}</div>
                    <div className="pipeline-card-stats">
                      <span className="stat">{p.num_nodes} nodes</span>
                      <span className="stat">{p.num_edges} edges</span>
                    </div>
                  </div>
                  <div className="pipeline-card-actions">
                    <div className="pipeline-card-date">{timeAgo(p.updated_at)}</div>
                    <button className="btn btn-sm" onClick={() => navigate(`/pipelines/${p.id}`)}>Open</button>
                    <button className="btn btn-sm btn-danger-text" onClick={() => askDelete(p.id, p.name)} disabled={deletingId === p.id}>
                      {deletingId === p.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <ConfirmDialog open={confirmOpen} title={`Delete "${confirmMeta.name}"?`} message={'This cannot be undone.'} onCancel={() => setConfirmOpen(false)} onConfirm={doDelete} />
    </div>
  );
};
