// draggableNode.js

export const DraggableNode = ({ type, label, tone }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      data-tone={tone}
      data-node-type={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      <div className="draggable-node-label">{label}</div>
      <div className="draggable-node-meta">{type}</div>
    </div>
  );
};
  