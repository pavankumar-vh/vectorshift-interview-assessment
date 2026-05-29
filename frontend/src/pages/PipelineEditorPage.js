import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import {
  apiCreateShare,
  apiGetPipeline,
  apiGetRuns,
  apiRunPipeline,
  apiUpdatePipeline,
  apiValidatePipeline,
} from '../api/client';
import { PipelineToolbar } from '../toolbar';
import { PipelineUI } from '../ui';
import { useStore } from '../store';

export const PipelineEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { nodes, edges, setPipeline, resetPipeline } = useStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      setPipeline: state.setPipeline,
      resetPipeline: state.resetPipeline,
    }),
    shallow
  );

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validation, setValidation] = useState(null);
  const [runs, setRuns] = useState([]);
  const [shareToken, setShareToken] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = useMemo(() => {
    if (!shareToken) {
      return '';
    }
    return `${window.location.origin}/share/${shareToken}`;
  }, [shareToken]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const pipeline = await apiGetPipeline(id);
        if (!isMounted) {
          return;
        }
        setName(pipeline.name);
        setDescription(pipeline.description || '');
        setPipeline(pipeline.nodes || [], pipeline.edges || []);

        const runData = await apiGetRuns(id);
        if (isMounted) {
          setRuns(runData.runs || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load pipeline');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
      resetPipeline();
    };
  }, [id, setPipeline, resetPipeline]);

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage('');
    setError('');

    try {
      await apiUpdatePipeline(id, {
        name: name.trim() || 'Untitled Pipeline',
        description: description.trim(),
        nodes,
        edges,
      });
      setStatusMessage('Saved changes to the pipeline.');
    } catch (err) {
      setError(err.message || 'Unable to save pipeline');
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    setStatusMessage('');
    setError('');

    try {
      const result = await apiValidatePipeline(nodes, edges);
      setValidation(result);
      setStatusMessage('Validation complete.');
    } catch (err) {
      setError(err.message || 'Unable to validate pipeline');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setStatusMessage('');
    setError('');

    try {
      await apiRunPipeline(id);
      const runData = await apiGetRuns(id);
      setRuns(runData.runs || []);
      setStatusMessage('Pipeline run recorded.');
    } catch (err) {
      setError(err.message || 'Unable to run pipeline');
    } finally {
      setIsRunning(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    setStatusMessage('');
    setError('');

    try {
      await apiUpdatePipeline(id, {
        name: name.trim() || 'Untitled Pipeline',
        description: description.trim(),
        nodes,
        edges,
      });
      const data = await apiCreateShare(id);
      setShareToken(data.token);
      setStatusMessage('Share link created with latest changes.');
    } catch (err) {
      setError(err.message || 'Unable to create share link');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyShare = async () => {
    if (!shareUrl) {
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      setStatusMessage('Share link copied.');
      return;
    }

    window.prompt('Copy share link:', shareUrl);
  };

  if (isLoading) {
    return <div className="panel-empty">Loading pipeline...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Pipeline editor</div>
          <div className="page-subtitle">
            Tune, validate, and simulate your pipeline in one view.
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" type="button" onClick={() => navigate('/pipelines')}>
            Back to list
          </button>
          <button className="btn btn-secondary" type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button className="btn btn-outline" type="button" onClick={handleValidate} disabled={isValidating}>
            {isValidating ? 'Validating...' : 'Validate'}
          </button>
          <button className="btn btn-primary" type="button" onClick={handleRun} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={handleShare} disabled={isSharing}>
            {isSharing ? 'Sharing...' : 'Share'}
          </button>
        </div>
      </div>

      {statusMessage ? <div className="banner banner-success">{statusMessage}</div> : null}
      {error ? <div className="banner banner-error">{error}</div> : null}

      <div className="editor-layout">
        <div className="editor-main">
          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Details</div>
                <div className="panel-subtitle">Keep the pipeline metadata tidy.</div>
              </div>
            </div>
            <div className="panel-form">
              <label className="form-field">
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
            </div>
          </section>

          <PipelineToolbar />
          <PipelineUI />
        </div>

        <aside className="editor-side">
          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Validation</div>
                <div className="panel-subtitle">Check structure and DAG status.</div>
              </div>
            </div>
            {validation ? (
              <div className="validation-grid">
                <div>
                  <div className="validation-label">Nodes</div>
                  <div className="validation-value">{validation.num_nodes}</div>
                </div>
                <div>
                  <div className="validation-label">Edges</div>
                  <div className="validation-value">{validation.num_edges}</div>
                </div>
                <div className="validation-status" data-status={validation.is_dag ? 'ok' : 'warn'}>
                  {validation.is_dag ? 'Valid DAG' : 'Cycle detected'}
                </div>
              </div>
            ) : (
              <div className="panel-empty">Run validation to see DAG results.</div>
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Share</div>
                <div className="panel-subtitle">Create a public read-only link.</div>
              </div>
            </div>
            {shareUrl ? (
              <div className="share-panel">
                <div className="share-url">{shareUrl}</div>
                <button className="btn btn-outline" type="button" onClick={handleCopyShare}>
                  Copy link
                </button>
              </div>
            ) : (
              <div className="panel-empty">No share link yet.</div>
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Run history</div>
                <div className="panel-subtitle">Simulated runs for this pipeline.</div>
              </div>
            </div>
            {runs.length === 0 ? (
              <div className="panel-empty">No runs recorded yet.</div>
            ) : (
              <div className="run-list">
                {runs.map((run) => (
                  <div key={run.id} className="run-item">
                    <div>
                      <div className="run-title">Run #{run.id}</div>
                      <div className="run-meta">
                        {new Date(run.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="run-status" data-status={run.result?.is_dag ? 'ok' : 'warn'}>
                      {run.result?.is_dag ? 'DAG' : 'Has cycles'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};
