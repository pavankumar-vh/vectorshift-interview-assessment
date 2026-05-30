import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const getHandleTop = (index, total) => {
  if (total <= 0) {
    return '50%';
  }

  return `${((index + 1) / (total + 1)) * 100}%`;
};

export const deriveNodeDefaults = (config) => {
  const defaults = {};

  (config.fields || []).forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaults[field.key] = field.defaultValue;
    }
  });

  return defaults;
};

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const removeNode = useStore((state) => state.removeNode);
  const inputs = config.inputs || [];
  const outputs = config.outputs || [];
  const fields = config.fields || [];

  const renderFieldInput = (field) => {
    const value = data[field.key] ?? '';
    const onChange = (event) => {
      updateNodeField(id, field.key, event.target.value);
    };
    const commonProps = {
      id: `${id}-${field.key}`,
      value,
      onChange,
      placeholder: field.placeholder || '',
    };

    if (field.kind === 'select') {
      return (
        <select {...commonProps}>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.kind === 'textarea') {
      return (
        <textarea
          {...commonProps}
          rows={field.rows || 3}
        />
      );
    }

    return (
      <input
        {...commonProps}
        type={field.inputType || field.kind || 'text'}
        {...(field.inputProps || {})}
      />
    );
  };

  return (
    <div className={`node node-${config.type}`}>
      <div className="node-header">
        <div>
          <div className="node-title">{config.title}</div>
          {config.subtitle ? (
            <div className="node-subtitle">{config.subtitle}</div>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {config.badge ? <span className="node-badge">{config.badge}</span> : null}
          <button className="node-delete-btn" onClick={() => removeNode(id)} title="Delete node">&times;</button>
        </div>
      </div>

      {fields.length > 0 ? (
        <div className="node-fields">
          {fields.map((field) => (
            <label key={field.key} className="node-field">
              <span className="node-field-label">{field.label}</span>
              {renderFieldInput(field)}
            </label>
          ))}
        </div>
      ) : null}

      {inputs.length > 0 || outputs.length > 0 ? (
        <div className="node-ports">
          <div className="node-ports-column">
            {inputs.map((handle) => (
              <div key={handle.id} className="node-port">
                {handle.label || handle.id}
              </div>
            ))}
          </div>
          <div className="node-ports-column node-ports-column-right">
            {outputs.map((handle) => (
              <div key={handle.id} className="node-port">
                {handle.label || handle.id}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {inputs.map((handle, index) => (
        <Handle
          key={`${id}-in-${handle.id}`}
          type="target"
          position={Position.Left}
          id={`${id}-${handle.id}`}
          style={{ top: getHandleTop(index, inputs.length) }}
        />
      ))}

      {outputs.map((handle, index) => (
        <Handle
          key={`${id}-out-${handle.id}`}
          type="source"
          position={Position.Right}
          id={`${id}-${handle.id}`}
          style={{ top: getHandleTop(index, outputs.length) }}
        />
      ))}
    </div>
  );
};

export const createNodeComponent = (config) => {
  const defaults = deriveNodeDefaults(config);

  const NodeComponent = ({ id, data }) => {
    const mergedData = { ...defaults, ...(data || {}) };
    return <BaseNode id={id} data={mergedData} config={config} />;
  };

  NodeComponent.displayName = `${config.type}Node`;
  return NodeComponent;
};
