// inputNode.js

import { createNodeComponent, deriveNodeDefaults } from './nodeFactory';

export const inputNodeConfig = {
  type: 'customInput',
  title: 'Input',
  subtitle: 'Start here',
  inputs: [],
  outputs: [{ id: 'value', label: 'value' }],
  fields: [
    {
      key: 'inputName',
      label: 'Name',
      kind: 'text',
      defaultValue: 'input',
      placeholder: 'input_name',
    },
    {
      key: 'inputType',
      label: 'Type',
      kind: 'select',
      defaultValue: 'Text',
      options: [
        { label: 'Text', value: 'Text' },
        { label: 'File', value: 'File' },
      ],
    },
  ],
};

export const inputNodeDefaults = deriveNodeDefaults(inputNodeConfig);

export const InputNode = createNodeComponent(inputNodeConfig);
