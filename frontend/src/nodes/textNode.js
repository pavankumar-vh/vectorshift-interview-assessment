// textNode.js

import { useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const VARIABLE_REGEX = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

const getHandleTop = (index, total) => {
  if (total <= 0) {
    return '50%';
  }

  return `${((index + 1) / (total + 1)) * 100}%`;
};

export const textNodeDefaults = {
  text: '{{input}}',
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const textValue = data?.text ?? textNodeDefaults.text;

  const variables = useMemo(() => {
    const matches = new Set();
    VARIABLE_REGEX.lastIndex = 0;
    let match = VARIABLE_REGEX.exec(textValue);

    while (match) {
      matches.add(match[1]);
      match = VARIABLE_REGEX.exec(textValue);
    }

    return Array.from(matches);
  }, [textValue]);

  const lines = textValue.split('\n');
  const longestLine = Math.max(...lines.map((line) => line.length), 1);
  const width = Math.min(420, Math.max(220, longestLine * 8 + 110));
  const height = Math.min(280, Math.max(140, lines.length * 22 + 110));
  const textAreaHeight = Math.max(60, height - 90);

  const handleTextChange = (event) => {
    updateNodeField(id, 'text', event.target.value);
  };

  return (
    <div className="node node-text" style={{ width, height }}>
      <div className="node-header">
        <div>
          <div className="node-title">Text</div>
          <div className="node-subtitle">Template variables</div>
        </div>
        <span className="node-badge">Template</span>
      </div>
      <div className="node-fields">
        <label className="node-field">
          <span className="node-field-label">Content</span>
          <textarea
            value={textValue}
            onChange={handleTextChange}
            rows={3}
            style={{ height: textAreaHeight }}
          />
        </label>
      </div>
      {variables.length > 0 ? (
        <div className="node-chips">
          {variables.map((variable) => (
            <span key={variable} className="node-chip">
              {variable}
            </span>
          ))}
        </div>
      ) : null}

      {variables.map((variable, index) => (
        <Handle
          key={`${id}-var-${variable}`}
          type="target"
          position={Position.Left}
          id={`${id}-var-${variable}`}
          style={{ top: getHandleTop(index, variables.length) }}
        />
      ))}

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
};
