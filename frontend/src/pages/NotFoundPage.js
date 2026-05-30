import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="not-found-page">
    <div className="not-found-card">
      <div className="not-found-code">404</div>
      <div className="not-found-title">Page not found</div>
      <p className="not-found-text">The page you're looking for doesn't exist.</p>
      <Link className="btn btn-primary" to="/pipelines">Back to pipelines</Link>
    </div>
  </div>
);
