export const OT = {
  NOP: 0,
  ADD: 0x2b,                //  43 '+'
  SUBTRACT: 0x2d,           //  45 '-'
  MULTIPLY: 0x2a,           //  42 '*'
  DEVIDE: 0x2f,             //  47 '/'
  MODULO: 0x25,             //  37 '%'
  POWER: 0x5e,              //  94 '^'
  BAND: 0x26,               //  38 '&'
  BOR: 0x7c,                // 124 '|'
  BXOR: 0x7e,               // 126 '~'
  BSHIFT: 0x3c3c,           //     '<<'
  BUNSHIFT: 0x3e3e,         //     '>>'
  NOT: 0x21,                //  33 '!'
  LAND: 0x2626,             //     '&&'
  LOR: 0x7c7c,              //     '||'
  LXOR: 0x7e7e,             //     '~~'
  EQUAL: 0x3d,              //  61 '='
  NOTEQUAL: 0x3c3e,         //     '<>'
  LESS: 0x3c,               //  60 '<'
  GREATER: 0x3e,            //  62 '>'
  LESSEQUAL: 0x3c3d,        //     '<='
  GREATEREQUAL: 0x3e3d,     //     '>='
  EEQUAL: 0x3d,             //     '==' exactly equal for future
  VMULTIPLY: 0x2a2a,        //     '**' for future
  MMULTIPLY: 0x2a2a2a,      //     '***' for future
};

export const TT = {
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

export const OTPRIO = [
  { dir: 1, types: [OT.NOT]},
  { dir: -1, types: [OT.POWER]},
  { dir: 1, types: [OT.MULTIPLY, OT.DEVIDE, OT.MODULO]},
  { dir: 1, types: [OT.VMULTIPLY]},
  { dir: 1, types: [OT.MMULTIPLY]},
  { dir: 1, types: [OT.BAND, OT.BOR, OT.BXOR, OT.BSHIFT, OT.BUNSHIFT]},
  { dir: 1, types: [OT.LAND, OT.LOR, OT.LXOR]},
  { dir: 1, types: [OT.ADD, OT.SUBTRACT]},
  { dir: 1, types: [OT.EQUAL, OT.NOTEQUAL, OT.LESS, OT.GREATER, OT.LESSEQUAL, OT.GREATEREQUAL]},
];

export const VAR = {
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

export const FUNC = {
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

export default {
  OT,
  TT,
  OTPRIO,
  VAR,
  FUNC,
}