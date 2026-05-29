import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="page">
    <div className="panel">
      <div className="panel-title">Page not found</div>
      <p className="panel-subtitle">
        The page you are looking for does not exist.
      </p>
      <Link className="btn btn-outline" to="/pipelines">
        Back to pipelines
      </Link>
    </div>
  </div>
);
