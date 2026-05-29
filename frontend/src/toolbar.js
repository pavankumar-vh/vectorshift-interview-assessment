// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodeCatalog } from './nodes';

export const PipelineToolbar = () => {
    return (
        <div className="toolbar">
            <div className="toolbar-header">
                <div>
                    <div className="toolbar-title">Node Library</div>
                    <div className="toolbar-subtitle">Drag to build a pipeline</div>
                </div>
                <div className="toolbar-pill">{nodeCatalog.length} nodes</div>
            </div>
            <div className="toolbar-grid">
                {nodeCatalog.map((node) => (
                    <DraggableNode
                        key={node.type}
                        type={node.type}
                        label={node.label}
                        tone={node.tone}
                    />
                ))}
            </div>
        </div>
    );
};
