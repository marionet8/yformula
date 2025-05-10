import { Option as _Option } from './interface';
import { Operator as _Operator, _operator } from './operation.js';
import { tokenize } from './tokenizer.js';
import { optimize } from './optimizer.js';
import { calculate, code } from './calculator.js';
import * as packageJson from '../package.json';

export const version = packageJson.version;

export const Operator = _Operator;

export function Option (option): _Option {
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
 * @param {Option} [option] Formula option
 * @param {boolean} [option.optimize] Optimize formula if true
 * @param {Object} [option.variable] Variable resolving map
 * @param {Object} [option.function] Function resolving map
 * @param {Function} [option.callVariable] Variable resolver function
 * @param {Function} [option.callFunction] Function resolver function
 * @param {Object} [option.argument] Argument for resolvers
 * @param {Operator} [option.operator] User operator instance extends Operator
 * @returns {Parser} { parse, setFunction, setVariable, callFunction, callVariable }
 */
export function Parser (option = {}) {
  const _this = {};
  const _option = Option(option);
  _this['setVariable'] = (name, value) => _option.function[name] = value;
  _this['setFunction'] = (name, fn) => _option.function[name] = fn;
  _this['callVariable'] = (fn) => _option.callVariable = fn;
  _this['callFunction'] = (fn) => _option.callFunction = fn;
  if (_option.optimize) {
    _this['parse'] = (formula: string, option = {}) => {
      const __option = Object.assign({}, _option, option instanceof Object ? option : {});
      const tokenized = tokenize(formula);
      const optimized = optimize(tokenized, __option);
      const calculated = calculate(optimized, __option);
      return calculated;
    }
  } else {
    _this['parse'] = (formula: string, option = {}) => {
      const __option = Object.assign({}, _option, option instanceof Object ? option : {});
      const tokenized = tokenize(formula);
      const calculated = calculate(tokenized, __option);
      return calculated;
    }
  }
  return _this;
}

/**
 * @summary Create Evaluator instance
 * @param {string} formula Formula string
 * @param {Option} [option] Formula option
 * @param {boolean} [option.optimize] Optimize formula if true
 * @param {Object} [option.variable] Variable resolving map
 * @param {Object} [option.function] Function resolving map
 * @param {Function} [option.callVariable] Variable resolver function
 * @param {Function} [option.callFunction] Function resolver function
 * @param {Object} [option.argument] Argument for resolvers
 * @param {Operator} [option.operator] User operator instance extends Operator
 * @returns {Evaluator} { calculate, setFunction, setVariable, callFunction, callVariable }
 */
export function Evaluator (formula: string, option = {}) {
  const _this = {};
  const _option = Option(option);
  _this['setVariable'] = (name, value) => _option.function[name] = value;
  _this['setFunction'] = (name, fn) => _option.function[name] = fn;
  _this['callVariable'] = (fn) => _option.callVariable = fn;
  _this['callFunction'] = (fn) => _option.callFunction = fn;
  const tokenized = tokenize(formula);
  if (_option.optimize) {
    const optimized = optimize(tokenized, _option);
    _this['calculate'] = (option = {}) => {
      const __option = Object.assign({}, _option, option instanceof Object ? option : {});
      const calculated = calculate(optimized, __option);
      return calculated;
    }
  } else {
    _this['calculate'] = (option = {}) => {
      const __option = Object.assign({}, _option, option instanceof Object ? option : {});
      const calculated = calculate(tokenized, __option);
      return calculated;
    }
  }
  return _this;
}

/**
 * @summary Create evaluated function
 * @param {string} formula Formula string
 * @param {Option} option Formula option
 * @param {Operator} option.operator User operator instance extends Operator
 * @returns {Function} Evaluated function
 */
export function evaluate (formula: string, option) {
  const _option = Option(option);
  const tokenized = tokenize(formula);
  const optimized = optimize(tokenized, _option);
  const coded = code(optimized);
  return eval(coded);
}

export default {
  version,
  Operator,
  Option,
  Parser,
  Evaluator,
  evaluate,
}