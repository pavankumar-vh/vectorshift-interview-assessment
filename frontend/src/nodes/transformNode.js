import { createNodeComponent, deriveNodeDefaults } from './nodeFactory';

export const transformNodeConfig = {
  type: 'transform',
  title: 'Transform',
  subtitle: 'Shape the payload',
  badge: 'Logic',
  inputs: [{ id: 'in', label: 'in' }],
  outputs: [{ id: 'out', label: 'out' }],
  fields: [
    {
      key: 'expression',
      label: 'Expression',
      kind: 'textarea',
      defaultValue: 'return input;',
      rows: 3,
      placeholder: 'return input;',
    },
  ],
};

export const transformNodeDefaults = deriveNodeDefaults(transformNodeConfig);

export const TransformNode = createNodeComponent(transformNodeConfig);
