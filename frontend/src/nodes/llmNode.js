// llmNode.js

import { createNodeComponent, deriveNodeDefaults } from './nodeFactory';

export const llmNodeConfig = {
  type: 'llm',
  title: 'LLM',
  subtitle: 'Reasoning core',
  badge: 'AI',
  inputs: [
    { id: 'system', label: 'system' },
    { id: 'prompt', label: 'prompt' },
  ],
  outputs: [{ id: 'response', label: 'response' }],
  fields: [
    {
      key: 'model',
      label: 'Model',
      kind: 'select',
      defaultValue: 'gpt-4.1',
      options: [
        { label: 'GPT-4.1', value: 'gpt-4.1' },
        { label: 'GPT-4.1 Mini', value: 'gpt-4.1-mini' },
        { label: 'Claude 3.5', value: 'claude-3.5' },
      ],
    },
    {
      key: 'temperature',
      label: 'Temperature',
      kind: 'number',
      inputType: 'number',
      defaultValue: 0.7,
      inputProps: {
        min: 0,
        max: 1,
        step: 0.1,
      },
    },
  ],
};

export const llmNodeDefaults = deriveNodeDefaults(llmNodeConfig);

export const LLMNode = createNodeComponent(llmNodeConfig);
