import { _operator } from '../src/operation';
import { tokenize } from '../src/tokenizer';
import { optimize } from '../src/optimizer';
import { calculate, code } from '../src/calculator';

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
              const coded = await code(tokens, option);
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
    } else {

    }
  }, 0);
} else {
  module.exports = {
    test: (formula) => calculate(optimize(tokenize(formula)), option).then(console.log).catch(console.error),
  };
}
