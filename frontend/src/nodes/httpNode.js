import { createNodeComponent, deriveNodeDefaults } from './nodeFactory';

export const httpNodeConfig = {
  type: 'http',
  title: 'HTTP',
  subtitle: 'Call an endpoint',
  badge: 'Utility',
  inputs: [{ id: 'payload', label: 'payload' }],
  outputs: [{ id: 'response', label: 'response' }],
  fields: [
    {
      key: 'url',
      label: 'URL',
      kind: 'text',
      defaultValue: 'https://api.example.com',
      placeholder: 'https://api.example.com',
    },
    {
      key: 'method',
      label: 'Method',
      kind: 'select',
      defaultValue: 'POST',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    {
      key: 'timeoutMs',
      label: 'Timeout (ms)',
      kind: 'number',
      inputType: 'number',
      defaultValue: 5000,
      inputProps: {
        min: 0,
        step: 250,
      },
    },
  ],
};

export const httpNodeDefaults = deriveNodeDefaults(httpNodeConfig);

export const HttpNode = createNodeComponent(httpNodeConfig);
