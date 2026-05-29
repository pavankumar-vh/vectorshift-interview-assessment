import { createNodeComponent, deriveNodeDefaults } from './nodeFactory';

export const filterNodeConfig = {
  type: 'filter',
  title: 'Filter',
  subtitle: 'Gate the flow',
  badge: 'Logic',
  inputs: [{ id: 'in', label: 'in' }],
  outputs: [{ id: 'passed', label: 'passed' }],
  fields: [
    {
      key: 'rule',
      label: 'Rule',
      kind: 'text',
      defaultValue: 'input.score > 0.5',
      placeholder: 'input.score > 0.5',
    },
  ],
};

export const filterNodeDefaults = deriveNodeDefaults(filterNodeConfig);

export const FilterNode = createNodeComponent(filterNodeConfig);
