import { _operator } from '../src/operation';
import { Parser, Evaluator, evaluate } from '../src/main';

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

// const formula = '6+3*4-12/2^3+(5-2)*7-17%11+8*sin(PI/180*30)-foo(ABC)'; // 31.377
const formula = '6+3*4-12/2^3+(5-2)*7-(17-11)+8*sin(PI/180*30)-sqrt(ABC)'; // 31.377

option.cache = true;
for (let ai = 2; ai < process.argv.length; ai++) {
  if (process.argv[ai].startsWith('--cache=')) {
    option.cache = process.argv[ai].slice('--cache='.length) !== 'false';
  }
}
setTimeout(async () => {
  let begin;

  const parser1 = new Parser(Object.assign({}, option, { optimize: true }));
  begin = Date.now();
  for (let ii = 0; ii < 10000; ii++) {
    await parser1.parse(formula);
  }
  console.log(`Parser optimize:true >>> ${Date.now() - begin}`);

  const parser2 = new Parser(Object.assign({}, option, { optimize: false }));
  begin = Date.now();
  for (let ii = 0; ii < 10000; ii++) {
    await parser2.parse(formula);
  }
  console.log(`Parser optimize:false >>> ${Date.now() - begin}`);

  const evaluator1 = new Evaluator(formula, Object.assign({}, option, { optimize: true }));
  begin = Date.now();
  for (let ii = 0; ii < 10000; ii++) {
    await evaluator1.calculate(Object.assign({}, option, {}));
  }
  console.log(`Evaluator optimize:true >>> ${Date.now() - begin}`);

  const evaluator2 = new Evaluator(formula, Object.assign({}, option, { optimize: false }));
  begin = Date.now();
  for (let ii = 0; ii < 10000; ii++) {
    await evaluator2.calculate(Object.assign({}, option, {}));
  }
  console.log(`Evaluator optimize:false >>> ${Date.now() - begin}`);

  const evaluated = evaluate(formula);
  begin = Date.now();
  for (let ii = 0; ii < 10000; ii++) {
    await evaluated(Object.assign({}, option, {}));
  }
  console.log(`Evaluated function >>> ${Date.now() - begin}`);
}, 0);
