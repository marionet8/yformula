import { Operator as _Operator, _operator } from './operation.js';
import { tokenize } from './tokenizer.js';
import { optimize } from './optimizer.js';
import { calculate, code } from './calculator.js';
import * as packageJson from '../package.json';

export const version = packageJson.version;

export function getOption (option) {
  const _option = option instanceof Object ? option : {};
  _option.optimize = typeof _option.optimize === 'boolean' ? _option.optimize : true;
  _option.cache = typeof _option.optimize === 'boolean' ? _option.cache : true;
  _option.variable = _option.variable instanceof Object ? _option.variable : {};
  _option.function = _option.function instanceof Object ? _option.function : {};
  _option.callVariable = _option.callVariable instanceof Function ? _option.callVariable : () => null;
  _option.callFunction = _option.callFunction instanceof Function ? _option.callFunction : () => null;
  _option.argument = _option.argument instanceof Object ? _option.argument : {};
  _option.operator = _option.operator instanceof _Operator ? _option.operator : _operator;
  return _option;
}

/**
 * @summary Create Parser instance
 * @param {Object} [option] Formula option
 * @param {boolean} [option.optimize] Optimize formula if true
 * @param {Object} [option.variable] Variable resolving map
 * @param {Object} [option.function] Function resolving map
 * @param {Function} [option.callVariable] Variable resolver function
 * @param {Function} [option.callFunction] Function resolver function
 * @param {Object} [option.argument] Argument for resolvers
 * @param {Object} [option.operator] User operator instance extends Operator
 * @returns {Parser} { parse, setFunction, setVariable, callFunction, callVariable }
 */
export function Parser (option = {}) {
  const _option = getOption(option);
  this.setVariable = (name, value) => _option.function[name] = value;
  this.setFunction = (name, fn) => _option.function[name] = fn;
  this.callVariable = (fn) => _option.callVariable = fn;
  this.callFunction = (fn) => _option.callFunction = fn;
  if (_option.optimize) {
    this.parse = (formula = '', option = {}) => {
      const __option = Object.assign({}, _option, option instanceof Object ? option : {});
      const tokenized = tokenize(formula);
      const optimized = optimize(tokenized, __option);
      const calculated = calculate(optimized, __option);
      return calculated;
    }
  } else {
    this.parse = (formula = '', option = {}) => {
      const __option = Object.assign({}, _option, option instanceof Object ? option : {});
      const tokenized = tokenize(formula);
      const calculated = calculate(tokenized, __option);
      return calculated;
    }
  }
  return this;
}

/**
 * @summary Create Evaluator instance
 * @param {string} formula Formula string
 * @param {Object} [option] Formula option
 * @param {boolean} [option.optimize] Optimize formula if true
 * @param {Object} [option.variable] Variable resolving map
 * @param {Object} [option.function] Function resolving map
 * @param {Function} [option.callVariable] Variable resolver function
 * @param {Function} [option.callFunction] Function resolver function
 * @param {Object} [option.argument] Argument for resolvers
 * @param {Object} [option.operator] User operator instance extends Operator
 * @returns {Evaluator} { calculate, setFunction, setVariable, callFunction, callVariable }
 */
export function Evaluator (formula, option = {}) {
  const _option = getOption(option);
  this.setVariable = (name, value) => _option.function[name] = value;
  this.setFunction = (name, fn) => _option.function[name] = fn;
  this.callVariable = (fn) => _option.callVariable = fn;
  this.callFunction = (fn) => _option.callFunction = fn;
  const tokenized = tokenize(formula);
  if (_option.optimize) {
    const optimized = optimize(tokenized, _option);
    this.calculate = (option = {}) => {
      const __option = Object.assign({}, _option, option instanceof Object ? option : {});
      const calculated = calculate(optimized, __option);
      return calculated;
    }
  } else {
    this.calculate = (option = {}) => {
      const __option = Object.assign({}, _option, option instanceof Object ? option : {});
      const calculated = calculate(tokenized, __option);
      return calculated;
    }
  }
  return this;
}

/**
 * @summary Create evaluated function
 * @param {string} formula Formula string
 * @param {Object} option Formula option
 * @param {Object} option.operator User operator instance extends Operator
 * @returns {Function} Evaluated function
 */
export function evaluate (formula, option) {
  const _option = getOption(option);
  const tokenized = tokenize(formula);
  const optimized = optimize(tokenized, _option);
  const coded = code(optimized);
  return eval(coded);
}

export const Operator = _Operator;

export default {
  version,
  getOption,
  Parser,
  Evaluator,
  evaluate,
  Operator,
}