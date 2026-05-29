import { createNodeComponent, deriveNodeDefaults } from './nodeFactory';

export const delayNodeConfig = {
  type: 'delay',
  title: 'Delay',
  subtitle: 'Pause before next step',
  badge: 'Utility',
  inputs: [{ id: 'in', label: 'in' }],
  outputs: [{ id: 'out', label: 'out' }],
  fields: [
    {
      key: 'delayMs',
      label: 'Delay (ms)',
      kind: 'number',
      inputType: 'number',
      defaultValue: 250,
      inputProps: {
        min: 0,
        step: 50,
      },
    },
  ],
};

export const delayNodeDefaults = deriveNodeDefaults(delayNodeConfig);

export const DelayNode = createNodeComponent(delayNodeConfig);
