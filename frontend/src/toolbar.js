import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { nodeCatalog } from './nodes';

export const PipelineToolbar = () => {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? nodeCatalog : nodeCatalog.filter((n) => n.tone === filter);

  return (
    <div className="toolbar">
      <div className="toolbar-header">
        <div>
          <div className="toolbar-title">Node library</div>
          <div className="toolbar-subtitle">Drag to canvas to add</div>
        </div>
        <div className="toolbar-pill">{nodeCatalog.length}</div>
      </div>
      <div className="toolbar-filters">
        {['all', 'core', 'logic', 'utility'].map((f) => (
          <button key={f} className={`toolbar-filter ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="toolbar-grid">
        {filtered.map((n) => <DraggableNode key={n.type} type={n.type} label={n.label} tone={n.tone} />)}
      </div>
    </div>
  );
};
