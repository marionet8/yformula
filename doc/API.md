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

## Option: object
<a id="Option"></a>

* optimize: boolean - Optimize formula if true. (default: true)
* cache: boolean - Cache variable and function resolved value if true. (default: true)
* variable: object - Variable resolving map. (Function is also allowed for value)
* function: object - Function resolving map.
* callVariable: Function - Variable resolver function.
* callFunction: Function - Function resolver function.
* argument: object - Argument for resolvers.
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
