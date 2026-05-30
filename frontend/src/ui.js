// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeTypes, nodeDefaults } from './nodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const miniMapColors = {
  customInput: '#1aa6a3',
  text: '#ffb15c',
  llm: '#ff8b3d',
  customOutput: '#1f7a8c',
  transform: '#f4c542',
  filter: '#f4c542',
  merge: '#f4c542',
  delay: '#ff8b3d',
  http: '#ff8b3d',
};

const getMiniMapColor = (node) => miniMapColors[node.type] || '#c2cad6';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = ({ readOnly = false }) => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      const baseData = {
        id: nodeID,
        nodeType: `${type}`,
        ...(nodeDefaults[type] || {}),
      };

      if (type === 'customInput') {
        baseData.inputName = nodeID.replace('customInput-', 'input_');
      }

      if (type === 'customOutput') {
        baseData.outputName = nodeID.replace('customOutput-', 'output_');
      }

      return baseData;
    };

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          if (!reactFlowInstance || !reactFlowWrapper.current) {
            return;
          }

          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const rawData = event?.dataTransfer?.getData('application/reactflow');
          if (rawData) {
            const appData = JSON.parse(rawData);
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, addNode, getNodeID]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
      <div ref={reactFlowWrapper} className="reactflow-wrapper">
        <ReactFlow
          className="reactflow-canvas"
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          onEdgeDoubleClick={readOnly ? undefined : (event, edge) => {
            onEdgesChange([{ id: edge.id, type: 'remove' }]);
          }}
          onDrop={readOnly ? undefined : onDrop}
          onDragOver={readOnly ? undefined : onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          deleteKeyCode={['Backspace', 'Delete']}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          fitView
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
          <MiniMap nodeColor={getMiniMapColor} maskColor="rgba(245, 240, 230, 0.8)" />
        </ReactFlow>
      </div>
    )
}
