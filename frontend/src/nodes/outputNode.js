// outputNode.js

import { createNodeComponent, deriveNodeDefaults } from './nodeFactory';

export const outputNodeConfig = {
  type: 'customOutput',
  title: 'Output',
  subtitle: 'Finish line',
  inputs: [{ id: 'value', label: 'value' }],
  outputs: [],
  fields: [
    {
      key: 'outputName',
      label: 'Name',
      kind: 'text',
      defaultValue: 'output',
      placeholder: 'result_name',
    },
    {
      key: 'outputType',
      label: 'Type',
      kind: 'select',
      defaultValue: 'Text',
      options: [
        { label: 'Text', value: 'Text' },
        { label: 'Image', value: 'Image' },
      ],
    },
  ],
};

export const outputNodeDefaults = deriveNodeDefaults(outputNodeConfig);

export const OutputNode = createNodeComponent(outputNodeConfig);
