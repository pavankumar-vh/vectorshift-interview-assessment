import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCreatePipeline, apiDeletePipeline, apiListPipelines } from '../api/client';

export const PipelinesPage = () => {
  const navigate = useNavigate();
  const [pipelines, setPipelines] = useState([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const loadPipelines = async (query = '') => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiListPipelines(query);
      setPipelines(data.pipelines || []);
    } catch (err) {
      setError(err.message || 'Unable to load pipelines');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPipelines();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadPipelines(search);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const pipeline = await apiCreatePipeline({
        name: name.trim() || 'Untitled Pipeline',
        description: description.trim() || '',
        nodes: [],
        edges: [],
      });
      navigate(`/pipelines/${pipeline.id}`);
    } catch (err) {
      setError(err.message || 'Unable to create pipeline');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (pipelineId, pipelineName) => {
    const confirmed = window.confirm(`Delete ${pipelineName}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setDeletingId(pipelineId);
    setError('');

    try {
      await apiDeletePipeline(pipelineId);
      await loadPipelines(search);
    } catch (err) {
      setError(err.message || 'Unable to delete pipeline');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Pipelines</div>
          <div className="page-subtitle">
            Manage, version, and share your pipeline library.
          </div>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search pipelines"
          />
          <button className="btn btn-outline" type="submit">
            Search
          </button>
        </form>
      </div>

      {error ? <div className="banner banner-error">{error}</div> : null}

      <div className="page-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Create a pipeline</div>
              <div className="panel-subtitle">
                Start with a name and description, then build in the editor.
              </div>
            </div>
          </div>
          <form className="panel-form" onSubmit={handleCreate}>
            <label className="form-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Onboarding flow"
              />
            </label>
            <label className="form-field">
              <span>Description</span>
              <textarea
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what this pipeline does"
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create pipeline'}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Recent pipelines</div>
              <div className="panel-subtitle">
                {pipelines.length} pipeline{pipelines.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="panel-empty">Loading pipelines...</div>
          ) : pipelines.length === 0 ? (
            <div className="panel-empty">No pipelines yet. Create one to begin.</div>
          ) : (
            <div className="pipeline-list">
              {pipelines.map((pipeline) => (
                <div key={pipeline.id} className="pipeline-card">
                  <div>
                    <div className="pipeline-card-title">{pipeline.name}</div>
                    <div className="pipeline-card-meta">
                      {pipeline.description || 'No description'}
                    </div>
                    <div className="pipeline-card-stats">
                      <span>{pipeline.num_nodes} nodes</span>
                      <span>{pipeline.num_edges} edges</span>
                    </div>
                  </div>
                  <div className="pipeline-card-actions">
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                    >
                      Open
                    </button>
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => handleDelete(pipeline.id, pipeline.name)}
                      disabled={deletingId === pipeline.id}
                    >
                      {deletingId === pipeline.id ? 'Deleting...' : 'Delete'}
                    </button>
                    <div className="pipeline-card-date">
                      Updated {new Date(pipeline.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
