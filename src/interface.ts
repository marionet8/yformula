import { Operator } from './operation';

export interface Token {
  opcode?: number;
  for?: number;
  type: number;
  value?: any;
  name?: string;
  parameters?: Token[][];
  tokens?: Token[];
  ref?: number;
}

export interface Option {
  optimized?: boolean;
  cache?: boolean;
  variable: Object;
  function: Object;
  callVariable: Function;
  callFunction: Function;
  argument?: Object;
  operator?: Operator;
}
