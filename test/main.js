const { getOption, Parser, Evaluator, evaluate } = require('../dist/index');

// Parser
const parser = new Parser();
parser.parse('6+3*4-12/2^3+(5-2)*7-17%11+8*sin(PI/180*30)').then(result => {
  console.log(result); // output 35.5
});

// Evaluator
const evaluator = new Evaluator('6+3*4-12/2^3+(5-2)*7-17%11+8*sin(PI/180*30)');
evaluator.calculate().then(result => {
  console.log(result); // output 35.5
});

// evaluate()
const option = getOption();
const evaluated = evaluate('6+3*4-12/2^3+(5-2)*7-17%11+8*sin(PI/180*30)', option);
evaluated(option).then(result => {
  console.log(result); // output 35.5
});