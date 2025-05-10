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
  optimize?: boolean;
  cache?: boolean;
  variable: object;
  function: object;
  callVariable: Function;
  callFunction: Function;
  argument?: object;
  operator?: Operator;
}
