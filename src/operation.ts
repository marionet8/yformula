import { Token } from './interface';
import { OT, TT } from './constant.js';

export class Operator {

  static _toLogical (val) {
    const type = typeof val;
    if (type === 'number') {
      return !!val;
    } else if (type === 'string') {
      return !!val;
    } else if (type === 'boolean') {
      return val;
    } else if (Array.isArray(val)) {
      return !!val.length;
    } else if (val instanceof Object) {
      return !!Object.keys(val).length;
    }
    return undefined;
  }

  constructor () {
    // no processing
  }

  add (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 + val2;
      } else if (type2 === 'string') {
        return val1 + Number(val2);
      } else if (type2 === 'boolean') {
        return val1 + val2;
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val1 + val2;
      } else if (type2 === 'string') {
        return val1 + val2;
      } else if (type2 === 'boolean') {
        return val1 + val2;
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return Boolean(val1 + val2);
      } else if (type2 === 'string') {
        return Boolean(val1 + Number(val2));
      } else if (type2 === 'boolean') {
        return Boolean(val1 + val2);
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.add(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.add(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.add(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.add(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  subtract (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 - val2;
      } else if (type2 === 'string') {
        return val1 - Number(val2);
      } else if (type2 === 'boolean') {
        return val1 - val2;
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        const _val2 = String(val2);
        if (val1.endsWith(_val2)) {
          return val1.slice(0, -_val2.length);
        } else {
          return val1;
        }
      } else if (type2 === 'string') {
        if (val1.endsWith(val2)) {
          return val1.slice(0, -val2.length);
        } else {
          return val1;
        }
      } else if (type2 === 'boolean') {
        const _val2 = String(val2);
        if (val1.endsWith(_val2)) {
          return val1.slice(0, -_val2.length);
        } else {
          return val1;
        }
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return Boolean(val1 - val2);
      } else if (type2 === 'string') {
        return Boolean(val1 - Number(val2));
      } else if (type2 === 'boolean') {
        return Boolean(val1 - val2);
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.subtract(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.subtract(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.subtract(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.subtract(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  multiply (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 * val2;
      } else if (type2 === 'string') {
        return val1 * Number(val2);
      } else if (type2 === 'boolean') {
        return val1 * val2;
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val2 > 0 ? Array(val2).fill(val1).join('') : '';
      } else if (type2 === 'string') {
        if (val1.indexOf(val2) >= 0) {
          return val2;
        } else {
          return '';
        }
      } else if (type2 === 'boolean') {
        return val2 ? val1 : '';
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return Boolean(val1 * val2);
      } else if (type2 === 'string') {
        return Boolean(val1 * Number(val2));
      } else if (type2 === 'boolean') {
        return Boolean(val1 * val2);
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.multiply(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.multiply(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.multiply(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.multiply(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  divide (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 / val2;
      } else if (type2 === 'string') {
        return val1 / Number(val2);
      } else if (type2 === 'boolean') {
        return val1 / val2;
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        const len = Math.trunc(val1.length / val2);
        return isNaN(len) || !isFinite(len) ? '' : len >= val1.length ? val1 : val1.slice(0, len);
      } else if (type2 === 'string') {
        if (val2) {
          return val1.replaceAll(val2, '');
        } else {
          return '';
        }
      } else if (type2 === 'boolean') {
        return val2 ? val1 : '';
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        const num = val1 / val2;
        return !isNaN(num) && isFinite(num) && num !== 0;
      } else if (type2 === 'string') {
        const num = val1 / Number(val2);
        return !isNaN(num) && isFinite(num) && num !== 0;
      } else if (type2 === 'boolean') {
        const num = val1 / val2;
        return !isNaN(num) && isFinite(num) && num !== 0;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.divide(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.divide(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.divide(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.divide(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  power (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return Math.pow(val1, val2);
      } else if (type2 === 'string') {
        return Math.pow(val1, Number(val2));
      } else if (type2 === 'boolean') {
        return Math.pow(val1, val2);
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val2 >= 1 ? val1 : '';
      } else if (type2 === 'string') {
        return Array.from(val2).filter(x => val1.indexOf(x) >= 0).join('');
      } else if (type2 === 'boolean') {
        return val2 ? val1 : '';
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return val1 || val2 === 0;
      } else if (type2 === 'string') {
        return val2.length === 0 ? true : val1;
      } else if (type2 === 'boolean') {
        return val1 || !val2;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.power(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.power(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.power(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.power(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  modulo (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 % val2;
      } else if (type2 === 'string') {
        return val1 % Number(val2);
      } else if (type2 === 'boolean') {
        return val1 % val2;
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        const len = Math.trunc(Math.trunc(val1.length / val2) * val2);
        return isNaN(len) || !isFinite(len) ? '' : len >= val1.length ? '' : val1.slice(-(val1.length - len));
      } else if (type2 === 'string') {
        return '';
      } else if (type2 === 'boolean') {
        return '';
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return Boolean(val1 % val2);
      } else if (type2 === 'string') {
        return Boolean(val1 % Number(val2));
      } else if (type2 === 'boolean') {
        return Boolean(val1 % val2);
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.modulo(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.modulo(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.modulo(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.modulo(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  bit_and (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return isNaN(val2) ? NaN : val1 & val2;
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? NaN : val1 & _val2;
      } else if (type2 === 'boolean') {
        return val1 & Number(val2);
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return isNaN(val2) ? '' : val2 >= 1 ? val1 : '';
      } else if (type2 === 'string') {
        return val2 ? val1 : '';
      } else if (type2 === 'boolean') {
        return val2 ? val1 : '';
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return isNaN(val2) ? false : val2 >= 1 ? val1 : false;
      } else if (type2 === 'string') {
        return val2 ? val1 : false;
      } else if (type2 === 'boolean') {
        return val2 ? val1 : false;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.bit_and(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.bit_and(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.bit_and(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.bit_and(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  bit_or (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return isNaN(val2) ? NaN : val1 | val2;
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? NaN : val1 | _val2;
      } else if (type2 === 'boolean') {
        return val1 | Number(val2);
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return isNaN(val2) ? '' : val1;
      } else if (type2 === 'string') {
        return val1;
      } else if (type2 === 'boolean') {
        return val1;
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return isNaN(val2) ? false : val2 >= 1 ? true : val1;
      } else if (type2 === 'string') {
        return val2 ? true : val1;
      } else if (type2 === 'boolean') {
        return val2 ? true : val1;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.bit_or(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.bit_or(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.bit_or(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.bit_or(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  bit_xor (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return isNaN(val2) ? NaN : val1 ^ val2;
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? NaN : val1 ^ _val2;
      } else if (type2 === 'boolean') {
        return val1 ^ Number(val2);
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return isNaN(val2) ? '' : val2 >= 1 ? '' : val1;
      } else if (type2 === 'string') {
        return val2 ? '' : val1;
      } else if (type2 === 'boolean') {
        return val2 ? '' : val1;
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return isNaN(val2) ? false : val2 >= 1 ? !val1 : val1;
      } else if (type2 === 'string') {
        return val2 ? !val1 : val1;
      } else if (type2 === 'boolean') {
        return val2 ? !val1 : val1;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.bit_xor(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.bit_xor(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.bit_xor(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.bit_xor(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  bit_shift (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return isNaN(val2) ? NaN : val1 << val2;
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? NaN : val1 << _val2;
      } else if (type2 === 'boolean') {
        return val1 << Number(val2);
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return isNaN(val2) ? '' : val2 >= 1 ? val1 + ' '.repeat(val2) : val1;
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? '' : _val2 >= 1 ? val1 + ' '.repeat(_val2) : val1;
      } else if (type2 === 'boolean') {
        return val2 ? val1 + ' ' : val1;
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return isNaN(val2) ? false : val1;
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? false : val1;
      } else if (type2 === 'boolean') {
        return val1;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.bit_shift(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.bit_shift(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.bit_shift(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.bit_shift(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  bit_unshift (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return isNaN(val2) ? NaN : val1 >> val2;
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? NaN : val1 >> Number(val2);
      } else if (type2 === 'boolean') {
        return val1 >> Number(val2);
      }
      return NaN;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return isNaN(val2) ? '' : val2 < 1 ? val1 : val2 <= val1.length ? val1.slice(0, val1.length - val2) : '';
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? '' : _val2 < 1 ? val1 : _val2 <= val1.length ? val1.slice(0, val1.length - _val2) : '';
      } else if (type2 === 'boolean') {
        return val2 ? val1.slice(0, -1) : val1;
      }
      return '';
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return isNaN(val2) ? false : val2 >= 1 ? false : val1;
      } else if (type2 === 'string') {
        const _val2 = Number(val2);
        return isNaN(_val2) ? false : _val2 >= 1 ? false : val1;
      } else if (type2 === 'boolean') {
        return val2 ? false : val1;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (type2 !== 'object') {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length; i1++) {
          result[i1] = this.bit_unshift(val1[i1], val2);
        }
        return result;
      } else if (Array.isArray(val2)) {
        const result = Array(val1.length);
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          result[i1] = this.bit_unshift(val1[i1], val2[i1]);
        }
        return result;
      }
      return null;
    } else if (val1 instanceof Object) {
      if (type2 !== 'object') {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          result[keys[i1]] = this.bit_unshift(val1[keys[i1]], val2);
        }
        return result;
      } else if (!Array.isArray(val2)) {
        const keys = Object.keys(val1);
        const result = {};
        for (let i1 = 0; i1 < keys.length; i1++) {
          if (keys[i1] in val2) {
            result[keys[i1]] = this.bit_unshift(val1[keys[i1]], val2[keys[i1]]);
          } else {
            result[keys[i1]] = val1[keys[i1]];
          }
        }
        return result;
      }
      return null;
    }
    return NaN;
  }

  not (val) {
    const _val = Operator._toLogical(val);
    return _val !== undefined ? !_val : false;
  }

  logical_and (val1, val2) {
    const _val1 = Operator._toLogical(val1);
    const _val2 = Operator._toLogical(val2);
    if (_val1 !== undefined && _val2 !== undefined) {
      return _val1 && _val2;
    } else if (_val1 !== undefined && _val2 === undefined) {
      return false;
    } else if (_val1 === undefined && _val2 !== undefined) {
      return false;
    } else {
      return false;
    }
  }

  logical_or (val1, val2) {
    const _val1 = Operator._toLogical(val1);
    const _val2 = Operator._toLogical(val2);
    if (_val1 !== undefined && _val2 !== undefined) {
      return _val1 || _val2;
    } else if (_val1 !== undefined && _val2 === undefined) {
      return _val1;
    } else if (_val1 === undefined && _val2 !== undefined) {
      return _val2;
    } else {
      return false;
    }
  }

  logical_xor (val1, val2) {
    const _val1 = Operator._toLogical(val1);
    const _val2 = Operator._toLogical(val2);
    if (_val1 !== undefined && _val2 !== undefined) {
      return (_val1 || _val2) && !(_val1 && _val2);
    } else if (_val1 !== undefined && _val2 === undefined) {
      return !_val1;
    } else if (_val1 === undefined && _val2 !== undefined) {
      return !_val2;
    } else {
      return true;
    }
  }

  equal (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 === val2;
      } else if (type2 === 'string') {
        return val1 === Number(val2);
      } else if (type2 === 'boolean') {
        return !!val1 === val2;
      }
      return false;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val1 === String(val2);
      } else if (type2 === 'string') {
        return val1 === val2;
      } else if (type2 === 'boolean') {
        return !!val1 === val2;
      }
      return false;
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return val1 === !!val2;
      } else if (type2 === 'string') {
        return val1 === !!val2;
      } else if (type2 === 'boolean') {
        return val1 === val2;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (Array.isArray(val2)) {
        if (val1.length !== val2.length) { return false }
        for (let i1 = 0; i1 < val1.length; i1++) {
          if (!this.equal(val1[i1], val2[i1])) { return false }
        }
        return true;
      }
      return false;
    } else if (val1 instanceof Object) {
      if (type2 === 'object' && !Array.isArray(val2)) {
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);
        if (keys1.length !== keys2.length) { return false }
        for (let i1 = 0; i1 < keys1.length; i1++) {
          if (keys1[i1] in val2 === false) { return false }
          if (!this.equal(val1[keys1[i1]], val2[keys1[i1]])) { return false }
        }
        return true;
      }
      return false;
    }
    return false;
  }

  notequal (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 !== val2;
      } else if (type2 === 'string') {
        return val1 !== Number(val2);
      } else if (type2 === 'boolean') {
        return !!val1 !== val2;
      }
      return true;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val1 !== String(val2);
      } else if (type2 === 'string') {
        return val1 !== val2;
      } else if (type2 === 'boolean') {
        return !!val1 !== val2;
      }
      return true;
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return val1 !== !!val2;
      } else if (type2 === 'string') {
        return val1 !== !!val2;
      } else if (type2 === 'boolean') {
        return val1 !== val2;
      }
      return true;
    } else if (Array.isArray(val1)) {
      if (Array.isArray(val2)) {
        if (val1.length !== val2.length) { return true }
        for (let i1 = 0; i1 < val1.length; i1++) {
          if (this.notequal(val1[i1], val2[i1])) { return true }
        }
        return false;
      }
      return true;
    } else if (val1 instanceof Object) {
      if (type2 === 'object' && !Array.isArray(val2)) {
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);
        if (keys1.length !== keys2.length) { return true }
        for (let i1 = 0; i1 < keys1.length; i1++) {
          if (keys1[i1] in val2 === false) { return true }
          if (this.notequal(val1[keys1[i1]], val2[keys1[i1]])) { return true }
        }
        return false;
      }
      return true;
    }
    return true;
  }

  less (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 < val2;
      } else if (type2 === 'string') {
        return val1 < Number(val2);
      } else if (type2 === 'boolean') {
        return !!val1 < val2;
      }
      return false;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val1 < String(val2);
      } else if (type2 === 'string') {
        return val1 < val2;
      } else if (type2 === 'boolean') {
        return !!val1 < val2;
      }
      return false;
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return val1 < !!val2;
      } else if (type2 === 'string') {
        return val1 < !!val2;
      } else if (type2 === 'boolean') {
        return val1 < val2;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (Array.isArray(val2)) {
        if (val1.length > val2.length) { return false }
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          if (!this.less(val1[i1], val2[i1])) { return false }
        }
        return true;
      }
      return false;
    } else if (val1 instanceof Object) {
      if (type2 === 'object' && !Array.isArray(val2)) {
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);
        for (let i1 = 0; i1 < keys1.length; i1++) {
          if (keys1[i1] in val2 === false) { return false }
          if (!this.less(val1[keys1[i1]], val2[keys1[i1]])) { return false }
        }
        return true;
      }
      return false;
    }
    return false;
  }

  greater (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 > val2;
      } else if (type2 === 'string') {
        return val1 > Number(val2);
      } else if (type2 === 'boolean') {
        return !!val1 > val2;
      }
      return false;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val1 > String(val2);
      } else if (type2 === 'string') {
        return val1 > val2;
      } else if (type2 === 'boolean') {
        return !!val1 > val2;
      }
      return false;
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return val1 > !!val2;
      } else if (type2 === 'string') {
        return val1 > !!val2;
      } else if (type2 === 'boolean') {
        return val1 > val2;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (Array.isArray(val2)) {
        if (val1.length < val2.length) { return false }
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          if (!this.greater(val1[i1], val2[i1])) { return false }
        }
        return true;
      }
      return false;
    } else if (val1 instanceof Object) {
      if (type2 === 'object' && !Array.isArray(val2)) {
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);
        for (let i1 = 0; i1 < keys1.length; i1++) {
          if (keys1[i1] in val2 === false) { continue }
          if (!this.greater(val1[keys1[i1]], val2[keys1[i1]])) { return false }
        }
        return true;
      }
      return false;
    }
    return false;
  }

  lessequal (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 <= val2;
      } else if (type2 === 'string') {
        return val1 <= Number(val2);
      } else if (type2 === 'boolean') {
        return !!val1 <= val2;
      }
      return false;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val1 <= String(val2);
      } else if (type2 === 'string') {
        return val1 <= val2;
      } else if (type2 === 'boolean') {
        return !!val1 <= val2;
      }
      return false;
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return val1 <= !!val2;
      } else if (type2 === 'string') {
        return val1 <= !!val2;
      } else if (type2 === 'boolean') {
        return val1 <= val2;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (Array.isArray(val2)) {
        if (val1.length > val2.length) { return false }
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          if (!this.lessequal(val1[i1], val2[i1])) { return false }
        }
        return true;
      }
      return false;
    } else if (val1 instanceof Object) {
      if (type2 === 'object' && !Array.isArray(val2)) {
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);
        for (let i1 = 0; i1 < keys1.length; i1++) {
          if (keys1[i1] in val2 === false) { continue }
          if (!this.lessequal(val1[keys1[i1]], val2[keys1[i1]])) { return false }
        }
        return true;
      }
      return false;
    }
    return false;
  }

  greaterequal (val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 === 'number') {
      if (type2 === 'number') {
        return val1 >= val2;
      } else if (type2 === 'string') {
        return val1 >= Number(val2);
      } else if (type2 === 'boolean') {
        return !!val1 >= val2;
      }
      return false;
    } else if (type1 === 'string') {
      if (type2 === 'number') {
        return val1 >= String(val2);
      } else if (type2 === 'string') {
        return val1 >= val2;
      } else if (type2 === 'boolean') {
        return !!val1 >= val2;
      }
      return false;
    } else if (type1 === 'boolean') {
      if (type2 === 'number') {
        return val1 >= !!val2;
      } else if (type2 === 'string') {
        return val1 >= !!val2;
      } else if (type2 === 'boolean') {
        return val1 >= val2;
      }
      return false;
    } else if (Array.isArray(val1)) {
      if (Array.isArray(val2)) {
        if (val1.length < val2.length) { return false }
        for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
          if (!this.greaterequal(val1[i1], val2[i1])) { return false }
        }
        return true;
      }
      return false;
    } else if (val1 instanceof Object) {
      if (type2 === 'object' && !Array.isArray(val2)) {
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);
        for (let i1 = 0; i1 < keys1.length; i1++) {
          if (keys1[i1] in val2 === false) { continue }
          if (!this.greaterequal(val1[keys1[i1]], val2[keys1[i1]])) { return false }
        }
        return true;
      }
      return false;
    }
    return false;
  }
}

export const _operator = new Operator();

/**
 * @summary Operate token1 `opcode` token2
 * @param token1 {Token|null} Operand 1
 * @param token2 {Token|null} Operand 2
 * @param opcode {number|undefined} Operation code
 * @param operator {Operator} Operator instance
 * @returns {Token} Operated result
 */
export function operate (token1: Token|null, token2: Token|null, opcode: number|undefined, operator: Operator): Token {
  let type: number = TT.UNKNOWN;
  let value: any = null;
  if (opcode === OT.ADD) {
    if (token1 && token2) {
      value = operator.add(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '+', token2.value);
    }
  } else if (opcode === OT.SUBTRACT) {
    if (token1 && token2) {
      value = operator.subtract(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '-', token2.value);
    }
  } else if (opcode === OT.MULTIPLY) {
    if (token1 && token2) {
      value = operator.multiply(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '*', token2.value);
    }
  } else if (opcode === OT.DEVIDE) {
    if (token1 && token2) {
      value = operator.divide(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '/', token2.value);
    }
  } else if (opcode === OT.POWER) {
    if (token1 && token2) {
      value = operator.power(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '^', token2.value);
    }
  } else if (opcode === OT.MODULO) {
    if (token1 && token2) {
      value = operator.modulo(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '%', token2.value);
    }
  } else if (opcode === OT.BAND) {
    if (token1 && token2) {
      value = operator.bit_and(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '&', token2.value);
    }
  } else if (opcode === OT.BOR) {
    if (token1 && token2) {
      value = operator.bit_or(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '|', token2.value);
    }
  } else if (opcode === OT.BXOR) {
    if (token1 && token2) {
      value = operator.bit_xor(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '~', token2.value);
    }
  } else if (opcode === OT.BSHIFT) {
    if (token1 && token2) {
      value = operator.bit_shift(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '<<', token2.value);
    }
  } else if (opcode === OT.BUNSHIFT) {
    if (token1 && token2) {
      value = operator.bit_unshift(token1.value, token2.value);
      type = token1.type;
      // console.debug(value, ':', token1.value, '>>', token2.value);
    }
  } else if (opcode === OT.NOT) {
    if (token2) {
      value = operator.not(token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, '!', token2.value);
    }
  } else if (opcode === OT.LAND) {
    if (token1 && token2) {
      value = operator.logical_and(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '&&', token2.value);
    }
  } else if (opcode === OT.LOR) {
    if (token1 && token2) {
      value = operator.logical_or(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '||', token2.value);
    }
  } else if (opcode === OT.LXOR) {
    if (token1 && token2) {
      value = operator.logical_xor(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '~~', token2.value);
    }
  } else if (opcode === OT.EQUAL) {
    if (token1 && token2) {
      value = operator.equal(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '=', token2.value);
    }
  } else if (opcode === OT.NOTEQUAL) {
    if (token1 && token2) {
      value = operator.notequal(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '<>', token2.value);
    }
  } else if (opcode === OT.LESS) {
    if (token1 && token2) {
      value = operator.less(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '<', token2.value);
    }
  } else if (opcode === OT.GREATER) {
    if (token1 && token2) {
      value = operator.greater(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '>', token2.value);
    }
  } else if (opcode === OT.LESSEQUAL) {
    if (token1 && token2) {
      value = operator.lessequal(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '<=', token2.value);
    }
  } else if (opcode === OT.GREATEREQUAL) {
    if (token1 && token2) {
      value = operator.greaterequal(token1.value, token2.value);
      type = TT.BOOLEAN;
      // console.debug(value, ':', token1.value, '>=', token2.value);
    }
  }
  return { type, value };
}

export default {
  Operator,
  _operator,
  operate,
}