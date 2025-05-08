# yformula

A simple and small formula parser library for JavaScript running on both of Server and Client (Browser).

## Feature

- `Number` `String` `Boolean` `Array` `Object` types.
- `+` `-` `*` `/` `^` `%` arithmetic operations.
- `&` `|` `~`(xor) `<<` `>>` bit operations.
- `!` `&&` `||` `~~` logical operations.
- `=` `<>` `<` `>` `<=` `>=` comparision operations.
- `E` `LN10` `LN2` `LOG10E` `LOG2E` `PI` `SQRT1_2` `SQRT2` all Math constants.
- `NULL` `TRUE` `FALSE` constants.
- `abs` `cos` `pow` `sqrt` and so on, all Math functions.
- Custom variables.
- Custom functions.
- Custom operations.
- `Parser` `Evaluator` classes.
- `evaluate` function returning runnable function.
- Both of Server and Client (Browser).

## License

Apache License 2.0

<br>

# How to use

## Install

```
$ npm install yformula
```

## Quick start

### Server
```
const { getOption, Parser, Evaluator, evaluate } = require('yformula');

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
```

### Client (Browser)
```
<script src="path/to/yformula.js"></script>

<body>
    <label for="parser_answer">Parser</label>
    <input id="parser_answer" type="text"></input>
    <br>
    <label for="evaluator_answer">Evaluator</label>
    <input id="evaluator_answer" type="text"></input>
    <br>
    <label for="evaluate_answer">evaluate()</label>
    <input id="evaluate_answer" type="text"></input>
</body>

<script>
    // Parser
    const parser = new yformula.Parser();
    parser.parse('6+3*4-12/2^3+(5-2)*7-17%11+8*sin(PI/180*30)').then(result => {
        document.getElementById('parser_answer').value = result; // output 35.5
    });

    // Evaluator
    const evaluator = new yformula.Evaluator('6+3*4-12/2^3+(5-2)*7-17%11+8*sin(PI/180*30)');
    evaluator.calculate().then(result => {
        document.getElementById('evaluator_answer').value = result; // output 35.5
    });

    // evaluate()
    const evaluated = yformula.evaluate('6+3*4-12/2^3+(5-2)*7-17%11+8*sin(PI/180*30)');
    evaluated(yformula.getOption({ operator: new yformula.Operator() })).then(result => {
        document.getElementById('evaluate_answer').value = result; // output 35.5
    });
</script>
```

## Parser (option: [Option](#Option)): Parser
<a id="Parser"></a>

`Parser()` returns Parser instance, it initialized by option.

* option: [Option](#Option) - Default option. **(Optional)**

Parser instance has following functions.

* parse(formula: string, option: [Option](#Option)) - It returns calculated result.
* setVariable(name: string, value: any|Function) - Set custom variable.
* setFunction(name: string, fn: Function) - Set custom function.
* callVariable(fn: Function) - Set custom variable resolver.
* callFunction(fn: Function) - Set custom function resolver.

## Evaluator (formula: string, option: [Option](#Option)): Evaluator
<a id="Evaluator"></a>

`Evaluator()` returns Evaluator instance, it parsed inputted formula string.

* formula: string - Formula string to be evaluated. **(Must)**
* option: [Option](#Option) - Default option. **(Optional)**

Evaluator instance has following functions.

* calculate(option: [Option](#Option)) - It returns calculated result.
* setVariable(name: string, value: any|Function) - Set custom variable.
* setFunction(name: string, fn: Function) - Set custom function.
* callVariable(fn: Function) - Set custom variable resolver.
* callFunction(fn: Function) - Set custom function resolver.

## evaluate (formula: string, option: [Option](#Option)): Function
<a id="evaluate"></a>

`evaluate()` returns preproessed function of formula string.

* formula: string - Formula string to be evaluated. **(Must)**
* option: [Option](#Option) - Default option. **(Must)**

Returned function is created to return calculated result as below. `option` must be the same one with `evaluate()`.

```
evaluated(option: [Option](#Option)): Promise\<any\>
```

## Operator: Class
<a id="Operator"></a>

Inheriting `Operator` instance can be given by [Option](#Option) to custom built in operations.

```
const { Parser, Operator } = require('yformula');

class MyOperator extends Operator {
  constructor () {
    super();
  }

  // override equal
  equal (val1, val2) {
    return String(val1) === String(val2);
  }
}

const parser = new Parser({ operator: new MyOperator() });
parser.parse('"null"=NULL').then(result => {
  console.log(result); // output true
});
```

## Option: Object
<a id="Option"></a>

* optimized: boolean - Optimize formula if true. (default: true)
* cache: boolean - Cache variable and function resolved value if true. (default: true)
* variable: Object - Variable resolving map. (Function is also allowed for value)
* function: Object - Function resolving map.
* callVariable: Function - Variable resolver function.
* callFunction: Function - Function resolver function.
* argument: Object - Argument for resolvers.
* operator: Operator - User operator instance extends Operator.

## Custom variable
<a id="Custom variable"></a>

Custom variables are given by option as below. (Here `arg` is given by option)

```
const option = {
  variable: {
    'ABC': 17,
    'DEF': (arg) => return name.toUpperCase(),
  },
  callVariable: (name, arg) => {
    if (name === 'XYZ') {
      return 'xyz';
    }
  },
};
```

## Custom function
<a id="Custom function"></a>

Custom functions are given by option as below. (Here `arg` is given by option)

```
const option = {
  function: {
    'foo': (params, arg) => Math.sqrt(params[0]),
  },
  callFunction: (name, params, arg) => {
    if (name === 'boo') {
      return params[0] * 2;
    }
  },
};
```

<br>

# Appendix

## [Performance](doc/Performance.md)

## [Specification of operators](doc/Operator.md)
