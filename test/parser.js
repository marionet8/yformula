'use strict';

const OT = {
    NOP: 0,
    ADD: 0x2b, //  43 '+'
    SUBTRACT: 0x2d, //  45 '-'
    MULTIPLY: 0x2a, //  42 '*'
    DEVIDE: 0x2f, //  47 '/'
    MODULO: 0x25, //  37 '%'
    POWER: 0x5e, //  94 '^'
    BAND: 0x26, //  38 '&'
    BOR: 0x7c, // 124 '|'
    BXOR: 0x7e, // 126 '~'
    BSHIFT: 0x3c3c, //     '<<'
    BUNSHIFT: 0x3e3e, //     '>>'
    NOT: 0x21, //  33 '!'
    LAND: 0x2626, //     '&&'
    LOR: 0x7c7c, //     '||'
    LXOR: 0x7e7e, //     '~~'
    EQUAL: 0x3d, //  61 '='
    NOTEQUAL: 0x3c3e, //     '<>'
    LESS: 0x3c, //  60 '<'
    GREATER: 0x3e, //  62 '>'
    LESSEQUAL: 0x3c3d, //     '<='
    GREATEREQUAL: 0x3e3d, //     '>='
    EEQUAL: 0x3d, //     '==' exactly equal for future
    VMULTIPLY: 0x2a2a, //     '**' for future
    MMULTIPLY: 0x2a2a2a, //     '***' for future
};
const TT$1 = {
    UNKNOWN: 0,
    NUMBER: 1,
    STRING: 2,
    BOOLEAN: 3,
    ARRAY: 4,
    OBJECT: 5,
    MATRIX: 6, // for future
    VARIABLE: 10,
    FUNCTION: 11,
    BRACKETS: 12,
    REF: 99,
};
const OTPRIO$1 = [
    { dir: 1, types: [OT.NOT] },
    { dir: -1, types: [OT.POWER] },
    { dir: 1, types: [OT.MULTIPLY, OT.DEVIDE, OT.MODULO] },
    { dir: 1, types: [OT.VMULTIPLY] },
    { dir: 1, types: [OT.MMULTIPLY] },
    { dir: 1, types: [OT.BAND, OT.BOR, OT.BXOR, OT.BSHIFT, OT.BUNSHIFT] },
    { dir: 1, types: [OT.LAND, OT.LOR, OT.LXOR] },
    { dir: 1, types: [OT.ADD, OT.SUBTRACT] },
    { dir: 1, types: [OT.EQUAL, OT.NOTEQUAL, OT.LESS, OT.GREATER, OT.LESSEQUAL, OT.GREATEREQUAL] },
];
const VAR$1 = {
    'E': Math.E,
    'LN10': Math.LN10,
    'LN2': Math.LN2,
    'LOG10E': Math.LOG10E,
    'LOG2E': Math.LOG2E,
    'PI': Math.PI,
    'SQRT1_2': Math.SQRT1_2,
    'SQRT2': Math.SQRT2,
    'NULL': null,
    'TRUE': true,
    'FALSE': false,
};
const FUNC$1 = {
    'abs': Math.abs,
    'acos': Math.acos,
    'acosh': Math.acosh,
    'asin': Math.asin,
    'asinh': Math.asinh,
    'atan': Math.atan,
    'atan2': Math.atan2,
    'atanh': Math.atanh,
    'cbrt': Math.cbrt,
    'ceil': Math.ceil,
    'clz32': Math.clz32,
    'cos': Math.cos,
    'cosh': Math.cosh,
    'exp': Math.exp,
    'expm1': Math.expm1,
    'floor': Math.floor,
    'fround': Math.fround,
    'hypot': Math.hypot,
    'imul': Math.imul,
    'log': Math.log,
    'log10': Math.log10,
    'log1p': Math.log1p,
    'log2': Math.log2,
    'max': Math.max,
    'min': Math.min,
    'pow': Math.pow,
    'random': Math.random,
    'round': Math.round,
    'sign': Math.sign,
    'sin': Math.sin,
    'sinh': Math.sinh,
    'sqrt': Math.sqrt,
    'tan': Math.tan,
    'tanh': Math.tanh,
    'trunc': Math.trunc,
};
var $c = {
    OT,
    TT: TT$1,
    OTPRIO: OTPRIO$1,
    VAR: VAR$1,
    FUNC: FUNC$1,
};

class Operator {
    static _toLogical(val) {
        const type = typeof val;
        if (type === 'number') {
            return !!val;
        }
        else if (type === 'string') {
            return !!val;
        }
        else if (type === 'boolean') {
            return val;
        }
        else if (Array.isArray(val)) {
            return !!val.length;
        }
        else if (val instanceof Object) {
            return !!Object.keys(val).length;
        }
        return undefined;
    }
    constructor() {
        // no processing
    }
    add(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 + val2;
            }
            else if (type2 === 'string') {
                return val1 + Number(val2);
            }
            else if (type2 === 'boolean') {
                return val1 + val2;
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val1 + val2;
            }
            else if (type2 === 'string') {
                return val1 + val2;
            }
            else if (type2 === 'boolean') {
                return val1 + val2;
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return Boolean(val1 + val2);
            }
            else if (type2 === 'string') {
                return Boolean(val1 + Number(val2));
            }
            else if (type2 === 'boolean') {
                return Boolean(val1 + val2);
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.add(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.add(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.add(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.add(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    subtract(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 - val2;
            }
            else if (type2 === 'string') {
                return val1 - Number(val2);
            }
            else if (type2 === 'boolean') {
                return val1 - val2;
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                const _val2 = String(val2);
                if (val1.endsWith(_val2)) {
                    return val1.slice(0, -_val2.length);
                }
                else {
                    return val1;
                }
            }
            else if (type2 === 'string') {
                if (val1.endsWith(val2)) {
                    return val1.slice(0, -val2.length);
                }
                else {
                    return val1;
                }
            }
            else if (type2 === 'boolean') {
                const _val2 = String(val2);
                if (val1.endsWith(_val2)) {
                    return val1.slice(0, -_val2.length);
                }
                else {
                    return val1;
                }
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return Boolean(val1 - val2);
            }
            else if (type2 === 'string') {
                return Boolean(val1 - Number(val2));
            }
            else if (type2 === 'boolean') {
                return Boolean(val1 - val2);
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.subtract(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.subtract(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.subtract(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.subtract(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    multiply(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 * val2;
            }
            else if (type2 === 'string') {
                return val1 * Number(val2);
            }
            else if (type2 === 'boolean') {
                return val1 * val2;
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val2 > 0 ? Array(val2).fill(val1).join('') : '';
            }
            else if (type2 === 'string') {
                if (val1.indexOf(val2) >= 0) {
                    return val2;
                }
                else {
                    return '';
                }
            }
            else if (type2 === 'boolean') {
                return val2 ? val1 : '';
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return Boolean(val1 * val2);
            }
            else if (type2 === 'string') {
                return Boolean(val1 * Number(val2));
            }
            else if (type2 === 'boolean') {
                return Boolean(val1 * val2);
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.multiply(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.multiply(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.multiply(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.multiply(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    divide(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 / val2;
            }
            else if (type2 === 'string') {
                return val1 / Number(val2);
            }
            else if (type2 === 'boolean') {
                return val1 / val2;
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                const len = Math.trunc(val1.length / val2);
                return isNaN(len) || !isFinite(len) ? '' : len >= val1.length ? val1 : val1.slice(0, len);
            }
            else if (type2 === 'string') {
                if (val2) {
                    return val1.replaceAll(val2, '');
                }
                else {
                    return '';
                }
            }
            else if (type2 === 'boolean') {
                return val2 ? val1 : '';
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                const num = val1 / val2;
                return !isNaN(num) && isFinite(num) && num !== 0;
            }
            else if (type2 === 'string') {
                const num = val1 / Number(val2);
                return !isNaN(num) && isFinite(num) && num !== 0;
            }
            else if (type2 === 'boolean') {
                const num = val1 / val2;
                return !isNaN(num) && isFinite(num) && num !== 0;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.divide(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.divide(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.divide(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.divide(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    power(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return Math.pow(val1, val2);
            }
            else if (type2 === 'string') {
                return Math.pow(val1, Number(val2));
            }
            else if (type2 === 'boolean') {
                return Math.pow(val1, val2);
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val2 >= 1 ? val1 : '';
            }
            else if (type2 === 'string') {
                return Array.from(val2).filter(x => val1.indexOf(x) >= 0).join('');
            }
            else if (type2 === 'boolean') {
                return val2 ? val1 : '';
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return val1 || val2 === 0;
            }
            else if (type2 === 'string') {
                return val2.length === 0 ? true : val1;
            }
            else if (type2 === 'boolean') {
                return val1 || !val2;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.power(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.power(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.power(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.power(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    modulo(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 % val2;
            }
            else if (type2 === 'string') {
                return val1 % Number(val2);
            }
            else if (type2 === 'boolean') {
                return val1 % val2;
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                const len = Math.trunc(Math.trunc(val1.length / val2) * val2);
                return isNaN(len) || !isFinite(len) ? '' : len >= val1.length ? '' : val1.slice(-(val1.length - len));
            }
            else if (type2 === 'string') {
                return '';
            }
            else if (type2 === 'boolean') {
                return '';
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return Boolean(val1 % val2);
            }
            else if (type2 === 'string') {
                return Boolean(val1 % Number(val2));
            }
            else if (type2 === 'boolean') {
                return Boolean(val1 % val2);
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.modulo(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.modulo(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.modulo(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.modulo(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    bit_and(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return isNaN(val2) ? NaN : val1 & val2;
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? NaN : val1 & _val2;
            }
            else if (type2 === 'boolean') {
                return val1 & Number(val2);
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return isNaN(val2) ? '' : val2 >= 1 ? val1 : '';
            }
            else if (type2 === 'string') {
                return val2 ? val1 : '';
            }
            else if (type2 === 'boolean') {
                return val2 ? val1 : '';
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return isNaN(val2) ? false : val2 >= 1 ? val1 : false;
            }
            else if (type2 === 'string') {
                return val2 ? val1 : false;
            }
            else if (type2 === 'boolean') {
                return val2 ? val1 : false;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.bit_and(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.bit_and(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.bit_and(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.bit_and(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    bit_or(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return isNaN(val2) ? NaN : val1 | val2;
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? NaN : val1 | _val2;
            }
            else if (type2 === 'boolean') {
                return val1 | Number(val2);
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return isNaN(val2) ? '' : val1;
            }
            else if (type2 === 'string') {
                return val1;
            }
            else if (type2 === 'boolean') {
                return val1;
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return isNaN(val2) ? false : val2 >= 1 ? true : val1;
            }
            else if (type2 === 'string') {
                return val2 ? true : val1;
            }
            else if (type2 === 'boolean') {
                return val2 ? true : val1;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.bit_or(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.bit_or(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.bit_or(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.bit_or(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    bit_xor(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return isNaN(val2) ? NaN : val1 ^ val2;
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? NaN : val1 ^ _val2;
            }
            else if (type2 === 'boolean') {
                return val1 ^ Number(val2);
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return isNaN(val2) ? '' : val2 >= 1 ? '' : val1;
            }
            else if (type2 === 'string') {
                return val2 ? '' : val1;
            }
            else if (type2 === 'boolean') {
                return val2 ? '' : val1;
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return isNaN(val2) ? false : val2 >= 1 ? !val1 : val1;
            }
            else if (type2 === 'string') {
                return val2 ? !val1 : val1;
            }
            else if (type2 === 'boolean') {
                return val2 ? !val1 : val1;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.bit_xor(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.bit_xor(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.bit_xor(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.bit_xor(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    bit_shift(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return isNaN(val2) ? NaN : val1 << val2;
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? NaN : val1 << _val2;
            }
            else if (type2 === 'boolean') {
                return val1 << Number(val2);
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return isNaN(val2) ? '' : val2 >= 1 ? val1 + ' '.repeat(val2) : val1;
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? '' : _val2 >= 1 ? val1 + ' '.repeat(_val2) : val1;
            }
            else if (type2 === 'boolean') {
                return val2 ? val1 + ' ' : val1;
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return isNaN(val2) ? false : val1;
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? false : val1;
            }
            else if (type2 === 'boolean') {
                return val1;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.bit_shift(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.bit_shift(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.bit_shift(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.bit_shift(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    bit_unshift(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return isNaN(val2) ? NaN : val1 >> val2;
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? NaN : val1 >> Number(val2);
            }
            else if (type2 === 'boolean') {
                return val1 >> Number(val2);
            }
            return NaN;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return isNaN(val2) ? '' : val2 < 1 ? val1 : val2 <= val1.length ? val1.slice(0, val1.length - val2) : '';
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? '' : _val2 < 1 ? val1 : _val2 <= val1.length ? val1.slice(0, val1.length - _val2) : '';
            }
            else if (type2 === 'boolean') {
                return val2 ? val1.slice(0, -1) : val1;
            }
            return '';
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return isNaN(val2) ? false : val2 >= 1 ? false : val1;
            }
            else if (type2 === 'string') {
                const _val2 = Number(val2);
                return isNaN(_val2) ? false : _val2 >= 1 ? false : val1;
            }
            else if (type2 === 'boolean') {
                return val2 ? false : val1;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (type2 !== 'object') {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length; i1++) {
                    result[i1] = this.bit_unshift(val1[i1], val2);
                }
                return result;
            }
            else if (Array.isArray(val2)) {
                const result = Array(val1.length);
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    result[i1] = this.bit_unshift(val1[i1], val2[i1]);
                }
                return result;
            }
            return null;
        }
        else if (val1 instanceof Object) {
            if (type2 !== 'object') {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    result[keys[i1]] = this.bit_unshift(val1[keys[i1]], val2);
                }
                return result;
            }
            else if (!Array.isArray(val2)) {
                const keys = Object.keys(val1);
                const result = {};
                for (let i1 = 0; i1 < keys.length; i1++) {
                    if (keys[i1] in val2) {
                        result[keys[i1]] = this.bit_unshift(val1[keys[i1]], val2[keys[i1]]);
                    }
                    else {
                        result[keys[i1]] = val1[keys[i1]];
                    }
                }
                return result;
            }
            return null;
        }
        return NaN;
    }
    not(val) {
        const _val = Operator._toLogical(val);
        return _val !== undefined ? !_val : false;
    }
    logical_and(val1, val2) {
        const _val1 = Operator._toLogical(val1);
        const _val2 = Operator._toLogical(val2);
        if (_val1 !== undefined && _val2 !== undefined) {
            return _val1 && _val2;
        }
        else if (_val1 !== undefined && _val2 === undefined) {
            return false;
        }
        else if (_val1 === undefined && _val2 !== undefined) {
            return false;
        }
        else {
            return false;
        }
    }
    logical_or(val1, val2) {
        const _val1 = Operator._toLogical(val1);
        const _val2 = Operator._toLogical(val2);
        if (_val1 !== undefined && _val2 !== undefined) {
            return _val1 || _val2;
        }
        else if (_val1 !== undefined && _val2 === undefined) {
            return _val1;
        }
        else if (_val1 === undefined && _val2 !== undefined) {
            return _val2;
        }
        else {
            return false;
        }
    }
    logical_xor(val1, val2) {
        const _val1 = Operator._toLogical(val1);
        const _val2 = Operator._toLogical(val2);
        if (_val1 !== undefined && _val2 !== undefined) {
            return (_val1 || _val2) && !(_val1 && _val2);
        }
        else if (_val1 !== undefined && _val2 === undefined) {
            return !_val1;
        }
        else if (_val1 === undefined && _val2 !== undefined) {
            return !_val2;
        }
        else {
            return true;
        }
    }
    equal(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 === val2;
            }
            else if (type2 === 'string') {
                return val1 === Number(val2);
            }
            else if (type2 === 'boolean') {
                return !!val1 === val2;
            }
            return false;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val1 === String(val2);
            }
            else if (type2 === 'string') {
                return val1 === val2;
            }
            else if (type2 === 'boolean') {
                return !!val1 === val2;
            }
            return false;
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return val1 === !!val2;
            }
            else if (type2 === 'string') {
                return val1 === !!val2;
            }
            else if (type2 === 'boolean') {
                return val1 === val2;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (Array.isArray(val2)) {
                if (val1.length !== val2.length) {
                    return false;
                }
                for (let i1 = 0; i1 < val1.length; i1++) {
                    if (!this.equal(val1[i1], val2[i1])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        else if (val1 instanceof Object) {
            if (type2 === 'object' && !Array.isArray(val2)) {
                const keys1 = Object.keys(val1);
                const keys2 = Object.keys(val2);
                if (keys1.length !== keys2.length) {
                    return false;
                }
                for (let i1 = 0; i1 < keys1.length; i1++) {
                    if (keys1[i1] in val2 === false) {
                        return false;
                    }
                    if (!this.equal(val1[keys1[i1]], val2[keys1[i1]])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        return false;
    }
    notequal(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 !== val2;
            }
            else if (type2 === 'string') {
                return val1 !== Number(val2);
            }
            else if (type2 === 'boolean') {
                return !!val1 !== val2;
            }
            return true;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val1 !== String(val2);
            }
            else if (type2 === 'string') {
                return val1 !== val2;
            }
            else if (type2 === 'boolean') {
                return !!val1 !== val2;
            }
            return true;
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return val1 !== !!val2;
            }
            else if (type2 === 'string') {
                return val1 !== !!val2;
            }
            else if (type2 === 'boolean') {
                return val1 !== val2;
            }
            return true;
        }
        else if (Array.isArray(val1)) {
            if (Array.isArray(val2)) {
                if (val1.length !== val2.length) {
                    return true;
                }
                for (let i1 = 0; i1 < val1.length; i1++) {
                    if (this.notequal(val1[i1], val2[i1])) {
                        return true;
                    }
                }
                return false;
            }
            return true;
        }
        else if (val1 instanceof Object) {
            if (type2 === 'object' && !Array.isArray(val2)) {
                const keys1 = Object.keys(val1);
                const keys2 = Object.keys(val2);
                if (keys1.length !== keys2.length) {
                    return true;
                }
                for (let i1 = 0; i1 < keys1.length; i1++) {
                    if (keys1[i1] in val2 === false) {
                        return true;
                    }
                    if (this.notequal(val1[keys1[i1]], val2[keys1[i1]])) {
                        return true;
                    }
                }
                return false;
            }
            return true;
        }
        return true;
    }
    less(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 < val2;
            }
            else if (type2 === 'string') {
                return val1 < Number(val2);
            }
            else if (type2 === 'boolean') {
                return !!val1 < val2;
            }
            return false;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val1 < String(val2);
            }
            else if (type2 === 'string') {
                return val1 < val2;
            }
            else if (type2 === 'boolean') {
                return !!val1 < val2;
            }
            return false;
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return val1 < !!val2;
            }
            else if (type2 === 'string') {
                return val1 < !!val2;
            }
            else if (type2 === 'boolean') {
                return val1 < val2;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (Array.isArray(val2)) {
                if (val1.length > val2.length) {
                    return false;
                }
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    if (!this.less(val1[i1], val2[i1])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        else if (val1 instanceof Object) {
            if (type2 === 'object' && !Array.isArray(val2)) {
                const keys1 = Object.keys(val1);
                for (let i1 = 0; i1 < keys1.length; i1++) {
                    if (keys1[i1] in val2 === false) {
                        return false;
                    }
                    if (!this.less(val1[keys1[i1]], val2[keys1[i1]])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        return false;
    }
    greater(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 > val2;
            }
            else if (type2 === 'string') {
                return val1 > Number(val2);
            }
            else if (type2 === 'boolean') {
                return !!val1 > val2;
            }
            return false;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val1 > String(val2);
            }
            else if (type2 === 'string') {
                return val1 > val2;
            }
            else if (type2 === 'boolean') {
                return !!val1 > val2;
            }
            return false;
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return val1 > !!val2;
            }
            else if (type2 === 'string') {
                return val1 > !!val2;
            }
            else if (type2 === 'boolean') {
                return val1 > val2;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (Array.isArray(val2)) {
                if (val1.length < val2.length) {
                    return false;
                }
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    if (!this.greater(val1[i1], val2[i1])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        else if (val1 instanceof Object) {
            if (type2 === 'object' && !Array.isArray(val2)) {
                const keys1 = Object.keys(val1);
                for (let i1 = 0; i1 < keys1.length; i1++) {
                    if (keys1[i1] in val2 === false) {
                        continue;
                    }
                    if (!this.greater(val1[keys1[i1]], val2[keys1[i1]])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        return false;
    }
    lessequal(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 <= val2;
            }
            else if (type2 === 'string') {
                return val1 <= Number(val2);
            }
            else if (type2 === 'boolean') {
                return !!val1 <= val2;
            }
            return false;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val1 <= String(val2);
            }
            else if (type2 === 'string') {
                return val1 <= val2;
            }
            else if (type2 === 'boolean') {
                return !!val1 <= val2;
            }
            return false;
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return val1 <= !!val2;
            }
            else if (type2 === 'string') {
                return val1 <= !!val2;
            }
            else if (type2 === 'boolean') {
                return val1 <= val2;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (Array.isArray(val2)) {
                if (val1.length > val2.length) {
                    return false;
                }
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    if (!this.lessequal(val1[i1], val2[i1])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        else if (val1 instanceof Object) {
            if (type2 === 'object' && !Array.isArray(val2)) {
                const keys1 = Object.keys(val1);
                for (let i1 = 0; i1 < keys1.length; i1++) {
                    if (keys1[i1] in val2 === false) {
                        continue;
                    }
                    if (!this.lessequal(val1[keys1[i1]], val2[keys1[i1]])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        return false;
    }
    greaterequal(val1, val2) {
        const type1 = typeof val1;
        const type2 = typeof val2;
        if (type1 === 'number') {
            if (type2 === 'number') {
                return val1 >= val2;
            }
            else if (type2 === 'string') {
                return val1 >= Number(val2);
            }
            else if (type2 === 'boolean') {
                return !!val1 >= val2;
            }
            return false;
        }
        else if (type1 === 'string') {
            if (type2 === 'number') {
                return val1 >= String(val2);
            }
            else if (type2 === 'string') {
                return val1 >= val2;
            }
            else if (type2 === 'boolean') {
                return !!val1 >= val2;
            }
            return false;
        }
        else if (type1 === 'boolean') {
            if (type2 === 'number') {
                return val1 >= !!val2;
            }
            else if (type2 === 'string') {
                return val1 >= !!val2;
            }
            else if (type2 === 'boolean') {
                return val1 >= val2;
            }
            return false;
        }
        else if (Array.isArray(val1)) {
            if (Array.isArray(val2)) {
                if (val1.length < val2.length) {
                    return false;
                }
                for (let i1 = 0; i1 < val1.length && i1 < val2.length; i1++) {
                    if (!this.greaterequal(val1[i1], val2[i1])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        else if (val1 instanceof Object) {
            if (type2 === 'object' && !Array.isArray(val2)) {
                const keys1 = Object.keys(val1);
                for (let i1 = 0; i1 < keys1.length; i1++) {
                    if (keys1[i1] in val2 === false) {
                        continue;
                    }
                    if (!this.greaterequal(val1[keys1[i1]], val2[keys1[i1]])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        return false;
    }
}
const _operator = new Operator();
/**
 * @summary Operate token1 `opcode` token2
 * @param token1 {Token|null} Operand 1
 * @param token2 {Token|null} Operand 2
 * @param opcode {number|undefined} Operation code
 * @param operator {Operator} Operator instance
 * @returns {Token} Operated result
 */
function operate(token1, token2, opcode, operator) {
    let type = TT$1.UNKNOWN;
    let value = null;
    if (opcode === OT.ADD) {
        if (token1 && token2) {
            value = operator.add(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '+', token2.value);
        }
    }
    else if (opcode === OT.SUBTRACT) {
        if (token1 && token2) {
            value = operator.subtract(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '-', token2.value);
        }
    }
    else if (opcode === OT.MULTIPLY) {
        if (token1 && token2) {
            value = operator.multiply(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '*', token2.value);
        }
    }
    else if (opcode === OT.DEVIDE) {
        if (token1 && token2) {
            value = operator.divide(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '/', token2.value);
        }
    }
    else if (opcode === OT.POWER) {
        if (token1 && token2) {
            value = operator.power(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '^', token2.value);
        }
    }
    else if (opcode === OT.MODULO) {
        if (token1 && token2) {
            value = operator.modulo(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '%', token2.value);
        }
    }
    else if (opcode === OT.BAND) {
        if (token1 && token2) {
            value = operator.bit_and(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '&', token2.value);
        }
    }
    else if (opcode === OT.BOR) {
        if (token1 && token2) {
            value = operator.bit_or(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '|', token2.value);
        }
    }
    else if (opcode === OT.BXOR) {
        if (token1 && token2) {
            value = operator.bit_xor(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '~', token2.value);
        }
    }
    else if (opcode === OT.BSHIFT) {
        if (token1 && token2) {
            value = operator.bit_shift(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '<<', token2.value);
        }
    }
    else if (opcode === OT.BUNSHIFT) {
        if (token1 && token2) {
            value = operator.bit_unshift(token1.value, token2.value);
            type = token1.type;
            // console.debug(value, ':', token1.value, '>>', token2.value);
        }
    }
    else if (opcode === OT.NOT) {
        if (token2) {
            value = operator.not(token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, '!', token2.value);
        }
    }
    else if (opcode === OT.LAND) {
        if (token1 && token2) {
            value = operator.logical_and(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '&&', token2.value);
        }
    }
    else if (opcode === OT.LOR) {
        if (token1 && token2) {
            value = operator.logical_or(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '||', token2.value);
        }
    }
    else if (opcode === OT.LXOR) {
        if (token1 && token2) {
            value = operator.logical_xor(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '~~', token2.value);
        }
    }
    else if (opcode === OT.EQUAL) {
        if (token1 && token2) {
            value = operator.equal(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '=', token2.value);
        }
    }
    else if (opcode === OT.NOTEQUAL) {
        if (token1 && token2) {
            value = operator.notequal(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '<>', token2.value);
        }
    }
    else if (opcode === OT.LESS) {
        if (token1 && token2) {
            value = operator.less(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '<', token2.value);
        }
    }
    else if (opcode === OT.GREATER) {
        if (token1 && token2) {
            value = operator.greater(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '>', token2.value);
        }
    }
    else if (opcode === OT.LESSEQUAL) {
        if (token1 && token2) {
            value = operator.lessequal(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '<=', token2.value);
        }
    }
    else if (opcode === OT.GREATEREQUAL) {
        if (token1 && token2) {
            value = operator.greaterequal(token1.value, token2.value);
            type = TT$1.BOOLEAN;
            // console.debug(value, ':', token1.value, '>=', token2.value);
        }
    }
    return { type, value };
}

const CODE = {
    'E100': 'Invalid formula',
    'E101': 'Invalid brackets',
    'E102': 'Unmatched brackets',
    'E103': 'Unclosed formula',
    'E105': 'Invalid object key',
    'E201': 'Invalid number',
    'E202': 'Too many commas in number',
    'E203': 'Invalid hex number',
    'E204': 'Invalid binary number',
    'E205': 'Invalid octet number',
    'E206': 'Unclosed string'};
class ParserError extends Error {
    constructor(message, pos, ...params) {
        super(...params);
        this.message = `${message || 'Unknown error'}${pos ? ` at ${pos}` : ''}`;
    }
}

const SPACE_CODES = [' ', '\t'].map(x => x.charCodeAt(0));
const ESCAPE_CODES1 = ['\\', '"', '\'', 't', 'a', 'n', 'b', '0'].map((x) => x.charCodeAt(0));
const ESCAPE_CODES2 = ['\\', '"', '\'', '\t', '\a', '\n', '\b', '\0'].map((x) => x.charCodeAt(0));
const OP_CODES = Object.values(OT);
const OP_CODES1 = OP_CODES.filter((x) => x > 0 && x < 128);
const OTHER = 0;
const INTEGER = 1;
const FLOAT = 2;
const HEX = 3;
const BIN = 4;
const OCT = 5;
function _parseNumber(str, type, idx) {
    if (type === INTEGER) {
        const num = Number.parseInt(str);
        if (Number.isNaN(num)) {
            throw new ParserError(CODE.E201, idx);
        }
        return num;
    }
    else if (type === FLOAT) {
        const num = Number.parseFloat(str);
        if (Number.isNaN(num)) {
            if (str.split('.').length > 1) {
                throw new ParserError(CODE.E202, idx);
            }
            else {
                throw new ParserError(CODE.E201, idx);
            }
        }
        return num;
    }
    else if (type === HEX) {
        const num = Number.parseInt(str.slice(2), 16);
        if (Number.isNaN(num)) {
            throw new ParserError(CODE.E203, idx);
        }
        return num;
    }
    else if (type === BIN) {
        const num = Number.parseInt(str.slice(2), 2);
        if (Number.isNaN(num)) {
            throw new ParserError(CODE.E204, idx);
        }
        return num;
    }
    else if (type === OCT) {
        const num = Number.parseInt(str.slice(2), 8);
        if (Number.isNaN(num)) {
            throw new ParserError(CODE.E205, idx);
        }
        return num;
    }
}
/**
 * @type function
 * @summary Tokenize formula string main loop
 * @param {string} str formula string
 * @param {number} [idx] cursor index of str
 * @param {number} [ec] end character code
 * @param {number} [dc] delimitter character code
 * @returns {Object} { tokens, idx }
 */
function _tokenize(str, idx = 0, ec = 0, dc = 0) {
    const tokens = [];
    let buf = '', bidx = 0, fixed = false, ntype = OTHER, otype = OT.NOP, not = false;
    for (let idx1 = idx; idx1 < str.length; idx1++) {
        const cc = str.charCodeAt(idx1);
        if (SPACE_CODES.indexOf(cc) >= 0) {
            if (buf.length > 0) {
                fixed = true;
            }
        }
        else if (cc === ec || cc === dc) {
            if (buf.length > 0) {
                const _type = ntype === OTHER ? TT$1.VARIABLE : TT$1.NUMBER;
                const _name = ntype === OTHER ? buf : undefined;
                const _value = ntype === OTHER ? undefined : _parseNumber(buf, ntype, bidx);
                if (not) {
                    tokens.push({ opcode: OT.NOT, for: NaN, type: _type, name: _name, value: _value });
                    tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT$1.REF, ref: -1 });
                }
                else {
                    tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: _type, name: _name, value: _value });
                }
            }
            return { tokens, idx: idx1 };
        }
        else if ([0x29, 0x7d, 0x5d].indexOf(cc) >= 0) { // ')' '}' ']'
            // console.debug(idx1, cc, ec, dc)
            throw new ParserError(CODE.E102, idx1);
        }
        else if (cc === 0x28) { // '('
            if (buf.length === 0) {
                const res = _tokenize(str, idx1 + 1, 0x29); // ')'
                if (not) {
                    tokens.push({ opcode: OT.NOT, for: NaN, type: TT$1.BRACKETS, tokens: res.tokens });
                    tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT$1.REF, ref: -1 });
                }
                else {
                    tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: TT$1.BRACKETS, tokens: res.tokens });
                }
                idx1 = res.idx;
            }
            else {
                const tokens2 = [];
                while (idx1 < str.length && str.charCodeAt(idx1) !== 0x29) {
                    const res = _tokenize(str, idx1 + 1, 0x29, 0x2c); // ')' ','
                    tokens2.push(res.tokens);
                    idx1 = res.idx;
                }
                if (not) {
                    tokens.push({ opcode: OT.NOT, for: NaN, type: TT$1.FUNCTION, name: buf, parameters: tokens2 });
                    tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT$1.REF, ref: -1 });
                }
                else {
                    tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: TT$1.FUNCTION, name: buf, parameters: tokens2 });
                }
            }
            buf = '';
            bidx = 0;
            fixed = false;
            ntype = OTHER;
            otype = OT.NOP;
            not = false;
        }
        else if (cc === 0x5b) { // '['
            if (buf.length > 0) {
                throw new ParserError(CODE.E101, idx1);
            }
            if (not) {
                throw new ParserError(CODE.E100, idx1);
            }
            const tokens2 = [];
            while (idx1 < str.length && str.charCodeAt(idx1) !== 0x5d) { // ']'
                const res = _tokenize(str, idx1 + 1, 0x5d, 0x2c); // ']' ','
                tokens2.push(res.tokens);
                idx1 = res.idx;
            }
            if (not) {
                tokens.push({ opcode: OT.NOT, for: NaN, type: TT$1.ARRAY, value: tokens2 });
                tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT$1.REF, ref: -1 });
            }
            else {
                tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: TT$1.ARRAY, value: tokens2 });
            }
            buf = '';
            bidx = 0;
            fixed = false;
            ntype = OTHER;
            otype = OT.NOP;
            not = false;
        }
        else if (cc === 0x7b) { // '{'
            if (buf.length > 0) {
                throw new ParserError(CODE.E101, idx1);
            }
            if (not) {
                throw new ParserError(CODE.E100, idx1);
            }
            const obj2 = {};
            while (idx1 < str.length && str.charCodeAt(idx1) !== 0x7d) { // '}'
                let keyname;
                const res1 = _tokenize(str, idx1 + 1, 0x7d, 0x3a); // '}' ':'
                if (res1.tokens.length !== 1) {
                    throw new ParserError(CODE.E105, idx1 + 1);
                }
                if (res1.tokens[0].type === TT$1.STRING) {
                    keyname = res1.tokens[0].value;
                }
                else if (res1.tokens[0].type === TT$1.VARIABLE) {
                    keyname = res1.tokens[0].name;
                }
                else {
                    throw new ParserError(CODE.E105, idx1 + 1);
                }
                const res2 = _tokenize(str, res1.idx + 1, 0x7d, 0x2c); // '}' ','
                obj2[keyname] = res2.tokens;
                idx1 = res2.idx;
            }
            if (not) {
                tokens.push({ opcode: OT.NOT, for: NaN, type: TT$1.OBJECT, value: obj2 });
                tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT$1.REF, ref: -1 });
            }
            else {
                tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: TT$1.OBJECT, value: obj2 });
            }
            buf = '';
            bidx = 0;
            fixed = false;
            ntype = OTHER;
            otype = OT.NOP;
            not = false;
        }
        else if ([0x22, 0x27].indexOf(cc) >= 0) { // '"' '\''
            if (buf.length > 0) {
                throw new ParserError(CODE.E100, idx1);
            }
            if (not) {
                throw new ParserError(CODE.E100, idx1);
            }
            let cc2 = str.charCodeAt(++idx1);
            while (cc2 !== cc && idx1 < str.length) {
                if (cc2 === 0x5c) { // '\'
                    const cc3 = str.charCodeAt(++idx1);
                    if (ESCAPE_CODES1.indexOf(cc3) >= 0) {
                        buf += ESCAPE_CODES2[ESCAPE_CODES1.indexOf(cc3)];
                    }
                }
                else {
                    buf += str.charAt(idx1);
                }
                cc2 = str.charCodeAt(++idx1);
            }
            if (cc2 !== cc) {
                throw new ParserError(CODE.E206, idx1);
            }
            tokens.push({ opcode: otype, for: -1, type: TT$1.STRING, value: buf });
            buf = '';
            bidx = 0;
            fixed = false;
            ntype = OTHER;
            otype = OT.NOP;
            not = false;
        }
        else if (cc === 0x21) { // '!'
            if (not) {
                throw new ParserError(CODE.E100, idx1);
            }
            if (buf.length > 0) {
                throw new ParserError(CODE.E100, idx1);
            }
            not = true;
        }
        else if (OP_CODES1.indexOf(cc) >= 0) {
            if (buf.length > 0) {
                const _type = ntype === OTHER ? TT$1.VARIABLE : TT$1.NUMBER;
                const _name = ntype === OTHER ? buf : undefined;
                const _value = ntype === OTHER ? undefined : _parseNumber(buf, ntype, bidx);
                if (not) {
                    tokens.push({ opcode: OT.NOT, for: NaN, type: _type, name: _name, value: _value });
                    tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT$1.REF, ref: -1 });
                }
                else {
                    tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: _type, name: _name, value: _value });
                }
                buf = '';
                bidx = 0;
                fixed = false;
                ntype = OTHER;
                otype = OT.NOP;
                not = false;
            }
            const cc2 = cc * 256 + str.charCodeAt(idx1 + 1);
            const cc3 = cc2 * 256 + str.charCodeAt(idx1 + 2);
            if (OP_CODES.indexOf(cc3) >= 0) {
                otype = cc3;
                idx1 += 2;
            }
            else if (OP_CODES.indexOf(cc2) >= 0) {
                otype = cc2;
                idx1 += 1;
            }
            else {
                otype = cc;
            }
        }
        else if (fixed) {
            throw new ParserError(CODE.E100, idx1);
        }
        else {
            if (buf.length === 0) {
                if (cc >= 0x30 && cc <= 0x39) {
                    ntype = INTEGER;
                    const cc2 = str.charCodeAt(idx1 + 1);
                    if (cc === 0x30) {
                        if (cc2 === 0x58 || cc2 === 0x78) { // 'X' 'x'
                            ntype = HEX;
                            idx1++;
                        }
                        else if (cc2 === 0x42 || cc2 === 0x62) { // 'B' 'b'
                            ntype = BIN;
                            idx1++;
                        }
                        else if (cc2 === 0x4f || cc2 === 0x6f) { // 'O' 'o'
                            ntype = OCT;
                            idx1++;
                        }
                    }
                }
                bidx = idx1;
            }
            else if (ntype === INTEGER && cc === 0x2e) { // '.'
                ntype = FLOAT;
            }
            else if ((ntype === INTEGER || ntype === FLOAT) && !(cc >= 0x30 && cc <= 0x39)) { // '0'-'9'
                ntype = OTHER;
            }
            else if (ntype === HEX && !((cc >= 0x30 && cc <= 0x39) || (cc >= 0x41 && cc <= 0x46) || (cc >= 0x61 && cc <= 0x66))) { // '0'-'9'/'A'-'F'/'a'-'f'
                ntype = OTHER;
            }
            else if (ntype === BIN && !(cc >= 0x30 && cc <= 0x31)) { // '0'-'1'
                ntype = OTHER;
            }
            else if (ntype === OCT && !(cc >= 0x30 && cc <= 0x37)) { // '0'-'7'
                ntype = OTHER;
            }
            buf += str.charAt(idx1);
        }
    }
    if (ec > 0) {
        throw new ParserError(CODE.E103, str.length);
    }
    if (buf.length > 0) {
        const _type = ntype === OTHER ? TT$1.VARIABLE : TT$1.NUMBER;
        const _name = ntype === OTHER ? buf : undefined;
        const _value = ntype === OTHER ? undefined : _parseNumber(buf, ntype, bidx);
        if (not) {
            tokens.push({ opcode: OT.NOT, for: NaN, type: _type, name: _name, value: _value });
            tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT$1.REF, ref: -1 });
        }
        else {
            tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: _type, name: _name, value: _value });
        }
    }
    return { tokens, idx: str.length };
}
/**
 * @type function
 * @summary Tokenize formula string
 * @param {string} str formula string
 * @returns {Array} tokens
 */
function tokenize(str) {
    const tokenized = _tokenize(str);
    return tokenized.tokens;
}

function _asToken$1(value) {
    const token = { type: TT$1.UNKNOWN, value };
    if (typeof value === 'number') {
        token.type = TT$1.NUMBER;
    }
    else if (typeof value === 'string') {
        token.type = TT$1.STRING;
    }
    else if (typeof value === 'boolean') {
        token.type = TT$1.BOOLEAN;
    }
    else if (Array.isArray(value)) {
        token.type = TT$1.ARRAY;
    }
    else if (value instanceof Object) {
        token.type = TT$1.OBJECT;
    }
    return token;
}
function _processArray(tokens, option, idx) {
    const values = [];
    for (let vi = 0; vi < tokens[idx].value.length; vi++) {
        values.push(_optimize(tokens[idx].value[vi], option));
    }
    return values;
}
function _processObject(tokens, option, idx) {
    const obj = {};
    const keys = Object.keys(tokens[idx].value);
    for (let ki = 0; ki < keys.length; ki++) {
        obj[keys[ki]] = _optimize(tokens[idx].value[keys[ki]], option);
    }
    return obj;
}
function _solveArray(token) {
    if (token.value.filter(x => !(x.length === 1 && x[0].type > TT$1.UNKNOWN && x[0].type < 10)).length > 0) {
        token.type = TT$1.UNKNOWN;
    }
    else {
        token.value = token.value.map(x => x[0].value);
    }
}
function _solveObject(token) {
    const keys = Object.keys(token.value);
    const obj = {};
    let isfixed = true;
    for (let ki = 0; ki < keys.length && isfixed; ki++) {
        if (token.value[keys[ki]].length !== 1) {
            isfixed = false;
        }
        else if (token.value[keys[ki]][0].type <= TT$1.UNKNOWN && token.value[keys[ki]][0].type >= 10) {
            isfixed = false;
        }
        else {
            obj[keys[ki]] = token.value[keys[ki]][0].value;
        }
    }
    if (!isfixed) {
        token.type = TT$1.UNKNOWN;
    }
    else {
        token.value = obj;
    }
}
function _optimize_main(tokens, option, idx, prio, results, refs) {
    // add tokens of 'for' and solve next index of 'for'.
    // fidx: index of 'for'
    // nfidx: next index of 'for'
    const fidx = isNaN(tokens[idx].for) ? NaN : tokens[idx].for >= 0 ? tokens[idx].for : idx + tokens[idx].for >= 0 ? idx + tokens[idx].for : NaN;
    let nfidx = NaN;
    if (!isNaN(fidx)) {
        if (!isNaN(refs[fidx])) {
            // consider about refs as next index of 'for'.
            nfidx = refs[fidx];
        }
        else if (tokens[fidx].type === TT$1.REF) {
            // consider about REF as self loop.
            const ridx = isNaN(tokens[fidx].ref) ? NaN : tokens[fidx].ref >= 0 ? tokens[fidx].ref : fidx + tokens[fidx].ref >= 0 ? fidx + tokens[fidx].ref : NaN;
            nfidx = _optimize_main(tokens, option, ridx, prio, results, refs);
        }
        else if (tokens[fidx].type === TT$1.ARRAY) {
            results.push({ opcode: OT.NOP, for: NaN, type: TT$1.ARRAY, value: _processArray(tokens, option, fidx) });
            nfidx = results.length - 1;
        }
        else if (tokens[fidx].type === TT$1.OBJECT) {
            results.push({ opcode: OT.NOP, for: NaN, type: TT$1.OBJECT, value: _processObject(tokens, option, fidx) });
            nfidx = results.length - 1;
        }
        else if (tokens[fidx].type === TT$1.VARIABLE) {
            if (tokens[fidx].name in VAR$1) {
                const token = { opcode: OT.NOP, for: NaN, type: TT$1.NUMBER, value: VAR$1[tokens[fidx].name] };
                if (typeof token.value === 'string') {
                    token.type = TT$1.STRING;
                }
                else if (typeof token.value === 'boolean') {
                    token.type = TT$1.BOOLEAN;
                }
                else if (Array.isArray(token.value)) {
                    token.type = TT$1.ARRAY;
                }
                else if (token.value instanceof Object) {
                    token.type = TT$1.OBJECT;
                }
                results.push(token);
                nfidx = results.length - 1;
            }
            else {
                results.push(Object.assign({}, tokens[fidx], { opcode: OT.NOP, for: NaN }));
                nfidx = results.length - 1;
            }
        }
        else if (tokens[fidx].type === TT$1.FUNCTION) {
            // consider about FUNCTION as deeply loop.
            const parameters = [];
            for (let pi = 0; pi < tokens[fidx].parameters.length; pi++) {
                parameters.push(_optimize(tokens[fidx].parameters[pi], option));
            }
            results.push({ opcode: OT.NOP, for: NaN, type: TT$1.FUNCTION, name: tokens[fidx].name, parameters: parameters });
            nfidx = results.length - 1;
        }
        else if (tokens[fidx].type === TT$1.BRACKETS) {
            // consider about BRACKETS as deeply loop.
            const _tokens = _optimize(tokens[fidx].tokens, option);
            if (_tokens.length > 1) {
                results.push({ opcode: OT.NOP, for: NaN, type: TT$1.BRACKETS, tokens: _tokens });
            }
            else if (_tokens.length === 1) {
                results.push({ opcode: OT.NOP, for: NaN, type: _tokens[0].type, value: _tokens[0].value });
            }
            else {
                results.push({ opcode: OT.NOP, for: NaN, type: TT$1.UNKNOWN, value: null });
            }
            nfidx = results.length - 1;
        }
        else {
            results.push(Object.assign({}, tokens[fidx], { opcode: OT.NOP, for: NaN }));
            nfidx = results.length - 1;
        }
    }
    // add current token and solve next index of current as 'reference'.
    // nridx: next index of 'reference'
    let nridx = NaN;
    if (!isNaN(refs[idx])) {
        // consider about refs as next index of current as 'reference'.
        if (tokens[idx].opcode !== OT.NOP) {
            results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT$1.REF, ref: refs[idx] });
            nridx = results.length - 1;
        }
        else {
            nridx = refs[idx];
        }
    }
    else if (tokens[idx].type === TT$1.REF) {
        // consider about REF as self loop.
        const ridx = isNaN(tokens[idx].ref) ? NaN : tokens[idx].ref >= 0 ? tokens[idx].ref : idx + tokens[idx].ref >= 0 ? idx + tokens[idx].ref : NaN;
        results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT$1.REF, ref: _optimize_main(tokens, option, ridx, prio, results, refs) });
        nridx = results.length - 1;
    }
    else if (tokens[idx].type === TT$1.ARRAY) {
        results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT$1.ARRAY, value: _processArray(tokens, option, idx) });
        nridx = results.length - 1;
    }
    else if (tokens[idx].type === TT$1.OBJECT) {
        results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT$1.OBJECT, value: _processObject(tokens, option, idx) });
        nridx = results.length - 1;
    }
    else if (tokens[idx].type === TT$1.VARIABLE) {
        if (tokens[idx].name in VAR$1) {
            const token = Object.assign({}, tokens[idx], { for: nfidx, type: TT$1.NUMBER, value: VAR$1[tokens[idx].name] });
            if (typeof token.value === 'string') {
                token.type = TT$1.STRING;
            }
            else if (typeof token.value === 'boolean') {
                token.type = TT$1.BOOLEAN;
            }
            else if (Array.isArray(token.value)) {
                token.type = TT$1.ARRAY;
            }
            else if (token.value instanceof Object) {
                token.type = TT$1.OBJECT;
            }
            results.push(token);
            nridx = results.length - 1;
        }
        else {
            results.push(Object.assign({}, tokens[idx], { for: nfidx }));
            nridx = results.length - 1;
        }
    }
    else if (tokens[idx].type === TT$1.FUNCTION) {
        // consider about FUNCTION as deeply loop.
        const parameters = [];
        for (let pi = 0; pi < tokens[idx].parameters.length; pi++) {
            parameters.push(_optimize(tokens[idx].parameters[pi], option));
        }
        results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT$1.FUNCTION, name: tokens[idx].name, parameters: parameters });
        nridx = results.length - 1;
    }
    else if (tokens[idx].type === TT$1.BRACKETS) {
        // consider about BRACKETS as deeply loop.
        const _tokens = _optimize(tokens[idx].tokens, option);
        if (_tokens.length > 1) {
            results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT$1.BRACKETS, tokens: _tokens });
        }
        else if (_tokens.length === 1) {
            results.push({ opcode: tokens[idx].opcode, for: nfidx, type: _tokens[0].type, value: _tokens[0].value });
        }
        else {
            results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT$1.UNKNOWN, value: null });
        }
        nridx = results.length - 1;
    }
    else {
        results.push(Object.assign({}, tokens[idx], { for: nfidx }));
        nridx = results.length - 1;
    }
    // results.forEach((x, i) => console.debug('AAAAA', i, x));
    // preprocess if possible
    if (!isNaN(nridx)) {
        const zridx = results[nridx].type !== TT$1.REF ? nridx : isNaN(results[nridx].ref) ? NaN : results[nridx].ref >= 0 ? results[nridx].ref : idx + results[nridx].ref >= 0 ? idx + results[nridx].ref : NaN;
        if (!isNaN(zridx)) {
            if (zridx === nridx || results[zridx].opcode === OT.NOP) {
                const rtoken = Object.assign({}, results[nridx], { type: results[zridx].type, value: results[zridx].value });
                if (rtoken.type === TT$1.ARRAY) {
                    _solveArray(rtoken);
                }
                else if (rtoken.type === TT$1.OBJECT) {
                    _solveObject(rtoken);
                }
                if (rtoken.type > TT$1.UNKNOWN && rtoken.type < 10) {
                    if (rtoken.opcode === OT.NOT) {
                        const operated = operate(null, rtoken, OT.NOT, option.operator || _operator);
                        results[nridx].opcode = OT.NOP;
                        results[nridx].type = operated.type;
                        results[nridx].value = operated.value;
                        results[nridx].ref = NaN;
                    }
                    else if (rtoken.opcode !== OT.NOP) {
                        if (!isNaN(nfidx)) {
                            const zfidx = results[nfidx].type !== TT$1.REF ? nfidx : isNaN(results[nfidx].ref) ? NaN : results[nfidx].ref >= 0 ? results[nfidx].ref : idx + results[nfidx].ref >= 0 ? idx + results[nfidx].ref : NaN;
                            if (!isNaN(zfidx)) {
                                const ftoken = Object.assign({}, results[nfidx], { type: results[zfidx].type, value: results[zfidx].value });
                                if (ftoken.opcode === OT.NOP || OTPRIO$1.slice(0, prio).filter(x => x.types.indexOf(ftoken.opcode) >= 0).length === 0) {
                                    if (ftoken.type === TT$1.ARRAY) {
                                        _solveArray(ftoken);
                                    }
                                    else if (ftoken.type === TT$1.OBJECT) {
                                        _solveObject(ftoken);
                                    }
                                    if (ftoken.type > TT$1.UNKNOWN && ftoken.type < 10) {
                                        const operated = operate(ftoken, rtoken, rtoken.opcode, option.operator || _operator);
                                        results[nfidx].type = operated.type;
                                        if (operated.type === TT$1.ARRAY) {
                                            results[nfidx].value = operated.value.map(x => [_asToken$1(x)]);
                                        }
                                        else if (operated.type === TT$1.OBJECT) {
                                            const obj = {};
                                            const keys = Object.keys(operated.value);
                                            for (let ki = 0; ki < keys.length; ki++) {
                                                obj[keys[ki]] = [_asToken$1(operated.value[keys[ki]])];
                                            }
                                            results[nfidx].value = obj;
                                        }
                                        else {
                                            results[nfidx].value = operated.value;
                                        }
                                        results[nfidx].ref = NaN;
                                        results[nridx].opcode = OT.NOP;
                                        results[nridx].for = NaN;
                                        results[nridx].ref = NaN;
                                        nridx = zfidx;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (!isNaN(refs[idx])) {
        for (let ri = 0; ri < refs.length; ri++) {
            if (ri !== idx && refs[ri] === refs[idx]) {
                refs[ri] = nridx;
            }
        }
    }
    refs[idx] = nridx;
    if (!isNaN(fidx)) {
        if (!isNaN(refs[fidx])) {
            for (let ri = 0; ri < refs.length; ri++) {
                if (ri !== fidx && refs[ri] === refs[fidx]) {
                    refs[ri] = nridx;
                }
            }
        }
        refs[fidx] = nridx;
    }
    // results.forEach((x, i) => console.debug('ZZZZZ', i, x));
    return nridx;
}
function _optimize(tokens, option) {
    const results = [];
    const refs = Array(tokens.length).fill(NaN);
    // call optimizer main by order of opcode priority
    if (tokens.length > 1) {
        for (let oi = 0; oi < OTPRIO$1.length; oi++) {
            if (OTPRIO$1[oi].dir > 0) {
                for (let ti = 0; ti < tokens.length; ti++) {
                    if (OTPRIO$1[oi].types.indexOf(tokens[ti].opcode) < 0) {
                        continue;
                    }
                    _optimize_main(tokens, option, ti, oi, results, refs);
                }
            }
            else {
                for (let ti = tokens.length - 1; ti >= 0; ti--) {
                    if (OTPRIO$1[oi].types.indexOf(tokens[ti].opcode) < 0) {
                        continue;
                    }
                    _optimize_main(tokens, option, ti, oi, results, refs);
                }
            }
        }
    }
    else if (tokens.length === 1) {
        results.push(tokens[0]);
        refs[0] = 0;
    }
    // remove unneccesary tokens from results
    for (let ti = results.length - 1; ti >= 0; ti--) {
        let hasfor = false, hasref = false, isref = false;
        for (let tj = 0; tj < results.length; tj++) {
            if (tj !== ti) {
                hasfor = hasfor || results[tj].for === ti;
                hasref = hasref || results[tj].ref === ti;
            }
        }
        for (let ri = 0; ri < refs.length; ri++) {
            isref = isref || refs[ri] === ti;
        }
        if (!hasfor && !hasref && !isref) {
            results.splice(ti, 1);
            for (let tj = 0; tj < results.length; tj++) {
                if (results[tj].for > ti) {
                    results[tj].for = results[tj].for - 1;
                }
                if (results[tj].ref > ti) {
                    results[tj].ref = results[tj].ref - 1;
                }
            }
            for (let ri = 0; ri < refs.length; ri++) {
                if (refs[ri] === ti) {
                    refs[ri] = NaN;
                }
                else if (refs[ri] > ti) {
                    refs[ri] = refs[ri] - 1;
                }
            }
        }
    }
    return results;
}
/**
 * @type function
 * @summary Optimize formula tokens
 * @param {Array} tokens Parsed formula tokens
 * @param {Object} option Formula option
 * @param {Object} option.variable Variable resolving map
 * @param {Object} option.function Function resolving map
 * @param {Function} option.callVariable Variable resolver function
 * @param {Function} option.callFunction Function resolver function
 * @param {Object} [option.argument] Argument for resolvers
 * @param {Object} [option.operator] User operator instance extends Operator
 * @returns {Array} Optimized formula tokens
 */
function optimize(tokens, option) {
    const optimized = _optimize(tokens, option);
    return optimized;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const { TT, OTPRIO, VAR, FUNC } = $c;
const varCache = {}; // {name: value}
const funcCache = {}; // {name: [{parameters, value}]}
function _toString$1(value) {
    if (Array.isArray(value)) {
        return '[' + value.map(x => _toString$1(x)).join(', ') + ']';
    }
    else if (value instanceof Object) {
        return '{' + Object.keys(value).map(x => `'${x}': ${_toString$1(value[x])}`).join(', ') + '}';
    }
    else if (typeof value === 'string') {
        return `'${value}'`;
    }
    else if (typeof value === 'undefined') {
        return `undefined`;
    }
    else if (isNaN(value)) {
        return 'NaN';
    }
    else if (value === Infinity) {
        return 'Infinity';
    }
    else if (value === -Infinity) {
        return '-Infinity';
    }
    else {
        return `${value}`;
    }
}
function _asToken(value) {
    const token = { type: TT.UNKNOWN, value };
    if (typeof value === 'number') {
        token.type = TT.NUMBER;
    }
    else if (typeof value === 'string') {
        token.type = TT.STRING;
    }
    else if (typeof value === 'boolean') {
        token.type = TT.BOOLEAN;
    }
    else if (Array.isArray(value)) {
        token.type = TT.ARRAY;
    }
    else if (value instanceof Object) {
        token.type = TT.OBJECT;
    }
    return token;
}
function _resolve(tokens, option, idx, results, refs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isNaN(refs[idx])) {
            return results[refs[idx]];
        }
        else if (tokens[idx].type === TT.REF) {
            const ridx = isNaN(tokens[idx].ref) ? NaN : tokens[idx].ref >= 0 ? tokens[idx].ref : idx + tokens[idx].ref >= 0 ? idx + tokens[idx].ref : NaN;
            return yield _resolve(tokens, option, ridx, results, refs);
        }
        else if (tokens[idx].type === TT.ARRAY) {
            for (let vi = 0; vi < tokens[idx].value.length; vi++) {
                const calculated = yield _calculate(tokens[idx].value[vi], option);
                tokens[idx].value[vi] = calculated.length > 0 ? calculated[calculated.length - 1].value : NaN;
            }
            return tokens[idx];
        }
        else if (tokens[idx].type === TT.OBJECT) {
            const obj = {};
            const keys = Object.keys(tokens[idx].value);
            for (let ki = 0; ki < keys.length; ki++) {
                const calculated = yield _calculate(tokens[idx].value[keys[ki]], option);
                obj[keys[ki]] = calculated.length > 0 ? calculated[calculated.length - 1].value : NaN;
            }
            tokens[idx].value = obj;
            return tokens[idx];
        }
        else if (tokens[idx].type === TT.VARIABLE) {
            if (option.cache && tokens[idx].name in varCache) {
                return varCache[tokens[idx].name];
            }
            let value = null;
            if (option.variable instanceof Object && tokens[idx].name in option.variable) {
                if (option.variable[tokens[idx].name] instanceof Function) {
                    value = _asToken(yield option.variable[tokens[idx].name](option.argument));
                }
                else {
                    value = _asToken(option.variable[tokens[idx].name]);
                }
            }
            else if (tokens[idx].name in VAR) {
                value = _asToken(VAR[tokens[idx].name]);
            }
            else {
                value = _asToken(yield option.callVariable(tokens[idx].name, option.argument));
            }
            if (option.cache) {
                varCache[tokens[idx].name] = value;
            }
            return value;
        }
        else if (tokens[idx].type === TT.FUNCTION) {
            const parameters = [];
            for (let pi = 0; pi < tokens[idx].parameters.length; pi++) {
                const calculated = yield _calculate(tokens[idx].parameters[pi], option);
                parameters.push(calculated.length > 0 ? calculated[calculated.length - 1].value : NaN);
            }
            if (option.cache && tokens[idx].name in funcCache) {
                for (let ci = 0; ci < funcCache[tokens[idx].name].length; ci++) {
                    if (_operator.equal(funcCache[tokens[idx].name][ci].parameters, parameters)) {
                        return funcCache[tokens[idx].name][ci].value;
                    }
                }
            }
            let value = null;
            if (option.function instanceof Object && tokens[idx].name in option.function) {
                value = _asToken(yield option.function[tokens[idx].name](parameters, option.argument));
            }
            else if (tokens[idx].name in FUNC) {
                value = _asToken(FUNC[tokens[idx].name](...parameters));
            }
            else {
                value = _asToken(option.callFunction(tokens[idx].name, parameters, option.argument));
            }
            if (option.cache) {
                if (!funcCache[tokens[idx].name]) {
                    funcCache[tokens[idx].name] = [];
                }
                funcCache[tokens[idx].name].push({ parameters, value });
            }
            return value;
        }
        else if (tokens[idx].type === TT.BRACKETS) {
            const calculated = yield _calculate(tokens[idx].tokens, option);
            return calculated.length > 0 ? calculated[calculated.length - 1] : { type: TT.UNKNOWN, value: NaN };
        }
        else {
            return tokens[idx];
        }
    });
}
function _resolveAsCode(tokens, idx, results, refs) {
    if (!isNaN(refs[idx])) {
        return `results[${refs[idx]}]`;
    }
    else if (tokens[idx].type === TT.REF) {
        const ridx = isNaN(tokens[idx].ref) ? NaN : tokens[idx].ref >= 0 ? tokens[idx].ref : idx + tokens[idx].ref >= 0 ? idx + tokens[idx].ref : NaN;
        return _resolveAsCode(tokens, ridx, results, refs);
    }
    else if (tokens[idx].type === TT.ARRAY) {
        const values = [];
        for (let vi = 0; vi < tokens[idx].value.length; vi++) {
            const calculated = _calculateAsCode(tokens[idx].value[vi]);
            if (calculated.length > 0) {
                const lines = [];
                lines.push(`const results = Array(${calculated.length}).fill(NaN);`);
                lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
                lines.push(`return results[${calculated.length - 1}].value;`);
                values.push(`await (async () => { ${lines.join(' \n')} })()`);
            }
            else {
                values.push(`NaN`);
            }
        }
        return `_asToken([${values.join(', ')}])`;
    }
    else if (tokens[idx].type === TT.OBJECT) {
        const values = [];
        const keys = Object.keys(tokens[idx].value);
        for (let ki = 0; ki < keys.length; ki++) {
            const calculated = _calculateAsCode(tokens[idx].value[keys[ki]]);
            if (calculated.length > 0) {
                const lines = [];
                lines.push(`const results = Array(${calculated.length}).fill(NaN);`);
                lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
                lines.push(`return results[${calculated.length - 1}].value;`);
                values.push(`['${keys[ki]}', await (async () => { ${lines.join(' \n')} })()]`);
            }
            else {
                values.push(`['${keys[ki]}', NaN]`);
            }
        }
        return `_asToken(Object.fromEntries([${values.join(', ')}]))`;
    }
    else if (tokens[idx].type === TT.VARIABLE) {
        const strs = [];
        strs.push(`_asToken(`);
        strs.push(`option.variable instanceof Object && '${tokens[idx].name}' in option.variable ? (`);
        strs.push(`option.variable['${tokens[idx].name}'] instanceof Function ? `);
        strs.push(`await option.variable['${tokens[idx].name}'](option.argument) : `);
        strs.push(`option.variable['${tokens[idx].name}']`);
        strs.push(`) : '${tokens[idx].name}' in VAR ? VAR['${tokens[idx].name}'] : `);
        strs.push(`await option.callVariable('${tokens[idx].name}', option.argument)`);
        strs.push(`)`);
        return strs.join(' \n');
    }
    else if (tokens[idx].type === TT.FUNCTION) {
        const args = [];
        for (let pi = 0; pi < tokens[idx].parameters.length; pi++) {
            const calculated = _calculateAsCode(tokens[idx].parameters[pi]);
            if (calculated.length > 0) {
                const lines = [];
                lines.push(`const results = Array(${calculated.length}).fill(NaN);`);
                lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
                lines.push(`return results[${calculated.length - 1}].value;`);
                args.push(`await (async () => { ${lines.join(' \n')} })()`);
            }
            else {
                args.push(`NaN`);
            }
        }
        const strs = [];
        strs.push(`_asToken(`);
        strs.push(`option.function instanceof Object && '${tokens[idx].name}' in option.function ? `);
        strs.push(`await option.function['${tokens[idx].name}']([${args.join(', ')}], option.argument) : `);
        strs.push(`'${tokens[idx].name}' in FUNC ? FUNC['${tokens[idx].name}'](${args.join(', ')}) : `);
        strs.push(`await option.callFunction('${tokens[idx].name}', [${args.join(', ')}], option.argument)`);
        strs.push(`)`);
        return strs.join(' \n');
    }
    else if (tokens[idx].type === TT.BRACKETS) {
        const calculated = _calculateAsCode(tokens[idx].tokens);
        if (calculated.length > 0) {
            const lines = [];
            lines.push(`const results = Array(${calculated.length}).fill(NaN);`);
            lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
            lines.push(`return results[${calculated.length - 1}].value;`);
            return `_asToken(await (async () => { ${lines.join(' \n')} })())`;
        }
        else {
            return `_asToken(NaN)`;
        }
    }
    else {
        return _toString$1(tokens[idx]);
    }
}
function _calculate_main(tokens, option, idx, results, refs) {
    return __awaiter(this, void 0, void 0, function* () {
        const fidx = isNaN(tokens[idx].for) ? NaN : tokens[idx].for >= 0 ? tokens[idx].for : idx + tokens[idx].for >= 0 ? idx + tokens[idx].for : NaN;
        let fval = null, cval = null;
        fval = isNaN(fidx) ? null : yield _resolve(tokens, option, fidx, results, refs);
        cval = yield _resolve(tokens, option, idx, results, refs);
        cval.opcode = tokens[idx].opcode;
        results.push(operate(fval, cval, tokens[idx].opcode, option.operator || _operator));
        if (!isNaN(refs[idx])) {
            for (let ri = 0; ri < refs.length; ri++) {
                if (ri !== idx && refs[ri] === refs[idx]) {
                    refs[ri] = results.length - 1;
                }
            }
        }
        refs[idx] = results.length - 1;
        if (!isNaN(fidx)) {
            if (!isNaN(refs[fidx])) {
                for (let ri = 0; ri < refs.length; ri++) {
                    if (ri !== fidx && refs[ri] === refs[fidx]) {
                        refs[ri] = results.length - 1;
                    }
                }
            }
            refs[fidx] = results.length - 1;
        }
    });
}
function _calculateAsCode_main(tokens, idx, results, refs) {
    const fidx = isNaN(tokens[idx].for) ? NaN : tokens[idx].for >= 0 ? tokens[idx].for : idx + tokens[idx].for >= 0 ? idx + tokens[idx].for : NaN;
    let fval = null, cval = null;
    fval = isNaN(fidx) ? null : _resolveAsCode(tokens, fidx, results, refs);
    cval = _resolveAsCode(tokens, idx, results, refs);
    results.push(`operate(${fval}, ${cval}, ${tokens[idx].opcode}, option.operator)`);
    if (!isNaN(refs[idx])) {
        for (let ri = 0; ri < refs.length; ri++) {
            if (ri !== idx && refs[ri] === refs[idx]) {
                refs[ri] = results.length - 1;
            }
        }
    }
    refs[idx] = results.length - 1;
    if (!isNaN(fidx)) {
        if (!isNaN(refs[fidx])) {
            for (let ri = 0; ri < refs.length; ri++) {
                if (ri !== fidx && refs[ri] === refs[fidx]) {
                    refs[ri] = results.length - 1;
                }
            }
        }
        refs[fidx] = results.length - 1;
    }
}
function _calculate(tokens, option) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const refs = Array(tokens.length).fill(NaN);
        if (tokens.length > 1) {
            for (let oi = 0; oi < OTPRIO.length; oi++) {
                if (OTPRIO[oi].dir > 0) {
                    for (let ti = 0; ti < tokens.length; ti++) {
                        if (OTPRIO[oi].types.indexOf(tokens[ti].opcode) < 0) {
                            continue;
                        }
                        yield _calculate_main(tokens, option, ti, results, refs);
                    }
                }
                else {
                    for (let ti = tokens.length - 1; ti >= 0; ti--) {
                        if (OTPRIO[oi].types.indexOf(tokens[ti].opcode) < 0) {
                            continue;
                        }
                        yield _calculate_main(tokens, option, ti, results, refs);
                    }
                }
            }
        }
        else if (tokens.length === 1) {
            results.push(yield _resolve(tokens, option, 0, results, refs));
            refs[0] = 0;
        }
        return results;
    });
}
function _calculateAsCode(tokens) {
    const results = [];
    const refs = Array(tokens.length).fill(NaN);
    if (tokens.length > 1) {
        for (let oi = 0; oi < OTPRIO.length; oi++) {
            if (OTPRIO[oi].dir > 0) {
                for (let ti = 0; ti < tokens.length; ti++) {
                    if (OTPRIO[oi].types.indexOf(tokens[ti].opcode) < 0) {
                        continue;
                    }
                    _calculateAsCode_main(tokens, ti, results, refs);
                }
            }
            else {
                for (let ti = tokens.length - 1; ti >= 0; ti--) {
                    if (OTPRIO[oi].types.indexOf(tokens[ti].opcode) < 0) {
                        continue;
                    }
                    _calculateAsCode_main(tokens, ti, results, refs);
                }
            }
        }
    }
    else if (tokens.length === 1) {
        results.push(_resolveAsCode(tokens, 0, results, refs));
        refs[0] = 0;
    }
    return results;
}
/**
 * @type function
 * @summary Calculate formula tokens
 * @param {Array} tokens Formula tokens
 * @param {Object} option Formula option
 * @param {boolean} [option.cache] Cache variable and function resolved value if true
 * @param {Object} option.variable Variable resolving map
 * @param {Object} option.function Function resolving map
 * @param {Function} option.callVariable Variable resolver function
 * @param {Function} option.callFunction Function resolver function
 * @param {Object} [option.argument] Argument for resolvers
 * @param {Object} [option.operator] User operator instance extends Operator
 * @returns {any} Calculated result
 */
function calculate(tokens, option) {
    return __awaiter(this, void 0, void 0, function* () {
        const calculated = yield _calculate(tokens, option);
        return calculated.length > 0 ? calculated[calculated.length - 1].value : NaN;
    });
}
/**
 * @type function
 * @summary Code formula tokens
 * @param {Array} tokens Formula tokens
 * @returns {string} Coded result
 */
function code(tokens) {
    const calculated = _calculateAsCode(tokens);
    const lines = [];
    if (calculated.length > 0) {
        lines.push(`(async (option) => {`);
        lines.push(...Object.keys($c).filter(x => ['FUNC'].indexOf(x) < 0).map(x => `const ${x} = ${JSON.stringify($c[x])};`));
        lines.push(`const FUNC = { ${Object.keys(FUNC).map(x => `${x}: Math.${FUNC[x].name}`).join(', ')} }`);
        // lines.push(Operator.toString());
        // lines.push(`const _operator = new Operator();`);
        lines.push(operate.toString());
        lines.push(_asToken.toString());
        lines.push(`const results = Array(${calculated.length}).fill(NaN);`);
        lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
        lines.push(`return results[${calculated.length - 1}].value;`);
        lines.push(`})`);
        return lines.join('\n');
    }
    else {
        return `(option) => NaN`;
    }
}

const option = {
  variable: {
    'ABC': 17,
  },
  function: {
    'foo': (args, param) => { return Math.sqrt(args[0]) }
  },
  callVariable: () => null,
  callFunction: () => null,
  operator: _operator,
};

const cases = [
  {
    // basic operators
    formula: '6+3*4-12/2^3+(5-2)*7-(17%11)',
    result: 31.5,
  }, {
    // built-in variables and functions
    formula: '8*sin(PI/180*30)',
    result: 4,
  }, {
    // extended variables and functions
    formula: 'foo(ABC)',
    result: 4.123,
  }, {
    // array
    formula: '[1,2,3,4,5]*3',
    result: [3,6,9,12,15],
  }, {
    // object
    formula: '{"a": 2, "b": "z"}*3',
    result: {"a": 6, "b": "zzz"},
  }, {
    // bit operators
    formula: '5<<2|5&15',
    result: 5,
  }, {
    // logical operators
    formula: '1&&"xyz"',
    result: true,
  }, {
    // comparision
    formula: '3>2&&3>4',
    result: false,
  }
];

function _toString (value) {
  if (Array.isArray(value)) {
    return '[' + value.map(x => _toString(x)).join(', ') + ']';
  } else if (value instanceof Object) {
    return '{' + Object.keys(value).map(x => `'${x}': ${_toString(value[x])}`).join(', ') + '}';
  } else if (typeof value === 'string') {
    return `'${value}'`;
  } else if (typeof value === 'undefiend') {
    return `undefined`;
  } else if (isNaN(value)) {
    return 'NaN';
  } else if (value === Infinity) {
    return 'Infinity';
  } else if (value === -Infinity) {
    return '-Infinity';
  } else {
    return `${value}`;
  }
}

if (process.argv[1] === __filename) {
  let level = 'info';
  let cmds = [];
  let todos = [];
  let opts = [];
  option.cache = true;
  for (let ai = 2; ai < process.argv.length; ai++) {
    if (process.argv[ai] === '-v') {
      level = process.argv[++ai];
    } else if (process.argv[ai].startsWith('--opt=')) {
      opts.push(process.argv[ai].slice('--opt='.length) !== 'false');
    } else if (process.argv[ai].startsWith('--cache=')) {
      option.cache = process.argv[ai].slice('--cache='.length) !== 'false';
    } else if (!process.argv[ai].startsWith('-')) {
      if (cmds.length === 0) {
        cmds.push(process.argv[ai]);
      } else {
        todos.push(process.argv[ai]);
      }
    }
  }
  if (level === 'info') {
    console.debug = () => undefined;
  }
  if (cmds.length === 0) {
    cmds = ['parse', 'evaluate'];
  }
  if (todos.length === 0) {
    todos = Array(cases.length).fill(0).map((x, i) => String(i));
  }
  if (opts.length === 0) {
    opts = [true, false];
  }
  setTimeout(async () => {
    if (cmds.indexOf('performance') < 0) {
      let allvalid = true;
      for (let ci = 0; ci < cmds.length; ci++) {
        const cmd = cmds[ci];
        for (let ti = 0; ti < todos.length; ti++) {
          if (!cases[todos[ti]]) { continue }
          for (let oi = 0; oi < opts.length; oi++) {
            const opt = opts[oi];
            let tokens, calculated;
            tokens = tokenize(cases[todos[ti]].formula);
            if (level === 'debug') {
              console.log(`${cmd} ${opt} tokenized-------------------------------`);
              tokens.forEach((x, i) => console.log(i, x));
            }
            if (opt) {
              tokens = optimize(tokens, option);
              if (level === 'debug') {
                console.log(`${cmd} ${opt} optimized-------------------------------`);
                tokens.forEach((x, i) => console.log(i, x));
              }
            }
            if (cmd === 'parse') {
              calculated = await calculate(tokens, option);
            } else if (cmd === 'evaluate') {
              const coded = await code(tokens);
              if (level === 'debug') {
                console.log(`${cmd} ${opt} coded-----------------------------------`);
                console.log(coded);
              }
              const fn = eval(coded);
              calculated = await fn(option);
            }
            console.log(cmd, opt, cases[todos[ti]].formula, '=>', _toString(calculated), 'expects', _toString(cases[todos[ti]].result));
            if (typeof cases[todos[ti]].result === 'number') {
              allvalid &&= Number(calculated).toFixed(3) === Number(cases[todos[ti]].result).toFixed(3);
            } else if (typeof cases[todos[ti]].result === 'string') {
              allvalid &&= calculated === cases[todos[ti]].result;
            } else if (typeof cases[todos[ti]].result === 'boolean') {
              allvalid &&= calculated === cases[todos[ti]].result;
            } else {
              allvalid &&= _toString(calculated) === _toString(cases[todos[ti]].result);
            }
          }
        }
      }
      console.log(allvalid ? '#Valid' : '#Invalid');
    }
  }, 0);
} else {
  module.exports = {
    test: (formula) => calculate(optimize(tokenize(formula)), option).then(console.log).catch(console.error),
  };
}
