import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetSharedPipeline } from '../api/client';
import { PipelineUI } from '../ui';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

export const SharePage = () => {
  const { token } = useParams();
  const { setPipeline, resetPipeline } = useStore(
    (state) => ({
      setPipeline: state.setPipeline,
      resetPipeline: state.resetPipeline,
    }),
    shallow
  );
  const [pipeline, setPipelineState] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await apiGetSharedPipeline(token);
        if (!isMounted) {
          return;
        }
        setPipelineState(data);
        setPipeline(data.nodes || [], data.edges || []);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load shared pipeline');
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
  }, [token, setPipeline, resetPipeline]);

  if (isLoading) {
    return <div className="panel-empty">Loading shared pipeline...</div>;
  }

  if (error) {
    return <div className="banner banner-error">{error}</div>;
  }

  return (
    <div className="share-page">
      <div className="share-header">
        <div>
          <div className="share-kicker">Shared pipeline</div>
          <div className="share-title">{pipeline?.name}</div>
          <div className="share-subtitle">{pipeline?.description}</div>
        </div>
        <div className="share-pill">Read only</div>
      </div>
      <PipelineUI readOnly />
    </div>
  );
};
