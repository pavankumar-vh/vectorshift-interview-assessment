import { createNodeComponent, deriveNodeDefaults } from './nodeFactory';

export const mergeNodeConfig = {
  type: 'merge',
  title: 'Merge',
  subtitle: 'Combine inputs',
  badge: 'Logic',
  inputs: [
    { id: 'a', label: 'a' },
    { id: 'b', label: 'b' },
  ],
  outputs: [{ id: 'out', label: 'out' }],
  fields: [
    {
      key: 'strategy',
      label: 'Strategy',
      kind: 'select',
      defaultValue: 'concat',
      options: [
        { label: 'Concat', value: 'concat' },
        { label: 'Zip', value: 'zip' },
        { label: 'First wins', value: 'first' },
      ],
    },
  ],
};

export const mergeNodeDefaults = deriveNodeDefaults(mergeNodeConfig);

export const MergeNode = createNodeComponent(mergeNodeConfig);
