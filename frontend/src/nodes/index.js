import { InputNode, inputNodeDefaults } from './inputNode';
import { OutputNode, outputNodeDefaults } from './outputNode';
import { LLMNode, llmNodeDefaults } from './llmNode';
import { TextNode, textNodeDefaults } from './textNode';
import { TransformNode, transformNodeDefaults } from './transformNode';
import { FilterNode, filterNodeDefaults } from './filterNode';
import { DelayNode, delayNodeDefaults } from './delayNode';
import { HttpNode, httpNodeDefaults } from './httpNode';
import { MergeNode, mergeNodeDefaults } from './mergeNode';

export const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  transform: TransformNode,
  filter: FilterNode,
  delay: DelayNode,
  http: HttpNode,
  merge: MergeNode,
};

export const nodeDefaults = {
  customInput: inputNodeDefaults,
  customOutput: outputNodeDefaults,
  llm: llmNodeDefaults,
  text: textNodeDefaults,
  transform: transformNodeDefaults,
  filter: filterNodeDefaults,
  delay: delayNodeDefaults,
  http: httpNodeDefaults,
  merge: mergeNodeDefaults,
};

export const nodeCatalog = [
  { type: 'customInput', label: 'Input', tone: 'core' },
  { type: 'text', label: 'Text', tone: 'core' },
  { type: 'llm', label: 'LLM', tone: 'core' },
  { type: 'customOutput', label: 'Output', tone: 'core' },
  { type: 'transform', label: 'Transform', tone: 'logic' },
  { type: 'filter', label: 'Filter', tone: 'logic' },
  { type: 'merge', label: 'Merge', tone: 'logic' },
  { type: 'delay', label: 'Delay', tone: 'utility' },
  { type: 'http', label: 'HTTP', tone: 'utility' },
];
