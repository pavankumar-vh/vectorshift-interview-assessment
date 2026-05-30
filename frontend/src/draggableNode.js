export const DraggableNode = ({ type, label, tone }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      data-tone={tone}
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={(e) => (e.target.style.cursor = 'grab')}
      draggable
    >
      <div className="draggable-node-label">{label}</div>
      <div className="draggable-node-meta">{type}</div>
    </div>
  );
};