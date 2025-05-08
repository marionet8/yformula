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

<br><br>

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

* option: [Option](#Option) - Default option.

Parser instance has following functions.

* parse(formula: string, option: [Option](#Option)) - It returns calculated result.
* setVariable(name: string, value: any|Function) - Set custom variable.
* setFunction(name: string, fn: Function) - Set custom function.
* callVariable(fn: Function) - Set custom variable resolver.
* callFunction(fn: Function) - Set custom function resolver.

## Evaluator (formula: string, option: [Option](#Option)): Evaluator
<a id="Evaluator"></a>

`Evaluator()` returns Evaluator instance, it parsed inputted formula string.

* formula: string - Formula string to be evaluated.
* option: [Option](#Option) - Default option.

Evaluator instance has following functions.

* calculate(option: [Option](#Option)) - It returns calculated result.
* setVariable(name: string, value: any|Function) - Set custom variable.
* setFunction(name: string, fn: Function) - Set custom function.
* callVariable(fn: Function) - Set custom variable resolver.
* callFunction(fn: Function) - Set custom function resolver.

## evaluate (formula: string): Function
<a id="evaluate"></a>

`evaluate()` returns preproessed function of formula string.

* formula: string - Formula string to be evaluated.

Returned function is created to return calculated result as below.

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

<br><br>

# Appendix

## Performance

As for formula `6+3*4-12/2^3+(5-2)*7-(17-11)+8*sin(PI/180*30)-sqrt(ABC)`, each processing time of `Parser` `Evaluator` `evaluate()` are below. (Normalized by Parser)

* Parser (with optimization) - 1.00
* Evaluator (with optimization) - 0.48
* evaluate() (with optimization) - 0.15 (Fastest)

## Specification of operators

### Add operator (`+`)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`+`8=15<br>7`+`-1=6|7`+`'5'=12<br>7`+`''=7<br>7`+`'xy'=`NaN`|7`+`true=8<br>7`+`false=7|`NaN`|`NaN`|
|String|'xyz'`+`7='xyz7'<br>'xyz'`+`-1='xyz-1'|'xyz'`+`'7'='xyz7'|'xyz'`+`true='xyztrue'<br>'xyz'`+`false='xyzfalse'|''|''|
|Boolean|true`+`7=true<br>true`+`-1=false<br>false`+`0=false<br>false`+`-1=true|true`+`'5'=true<br>true`+`'-1'=false<br>false`+`''=false<br>false`+`'5'=true<br>true`+`'xy'=false|true`+`true=true<br>true`+`false=true<br>false`+`true=true<br>false`+`false=false|false|false|
|Array|[3, 5]`+`7=[10, 12]<br>[3, 'ab']`+`7=[10, 'ab7']|[3, 5]`+`'5'=[8, 10]<br>[3, 'ab']`+`'5'=[8, 'ab5']<br>[3, 'ab']`+`'xy'=[`NaN`, 'abxy']|[3, 5]`+`true=[4, 6]<br>[3, 'ab']`+`false=[3, 'abfalse']|[3, 5]`+`[3, 5]=[6, 10]<br>[3, 5]`+`[3, 'ab']=[6, `NaN`]<br>[3, 'ab']`+`[3, 5]=[6, 'ab5']|`null`|
|Object|{'a': 5, 'b': 'z'}`+`7={'a': 12, 'b': 'z7'}|{'a': 5, 'b': 'z'}`+`'xy'={'a': `NaN`, 'b': 'zxy'}|{'a': 5, 'b': 'z'}`+`true={'a': 6, 'b': 'ztrue'}<br>{'a': 5, 'b': 'z'}`+`false={'a': 5, 'b': 'zfalse'}|`null`|{'a': 5, 'b': 8}`+`{'a': 5, 'b': 'z'}={'a': 10, 'b': `NaN`}<br>{'a': 5, 'b': 'z'}`+`{'a': 5, 'b': 8}={'a': 10, 'b': 'z8'}<br>{'a': 5, 'b': 'z'}`+`{'a': 5, 'b': 'z'}={'a': 10, 'b': 'zz'}|











### Subtract operator (`-`)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`-`5=2<br>7`-`-1=8|7`-`'5'=2<br>7`-`''=7<br>7`-`'xy'=`NaN`|7`-`true=6<br>7`-`false=7|`NaN`|`NaN`|
|String|'xyz2'`-`2='xyz'|'xyz'`-`'yz'='x'|'xyz'`-`true='xyz'<br>'xfalse'`-`false='x'|''|''|
|Boolean|true`-`7=true<br>true`-`1=false<br>false`-`0=false<br>false`-`-1=true|true`-`'5'=true<br>true`-`'1'=false<br>false`-`''=false<br>false`-`'5'=true<br>true`-`'xy'=false|true`-`true=false<br>true`-`false=true<br>false`-`true=true<br>false`-`false=false|false|false|
|Array|[3, 5]`-`7=[-4, -2]<br>[3, 'ab7']`-`7=[-4, 'ab']|[3, 5]`-`'5'=[-2, 0]<br>[3, 'ab5']`-`'5'=[-2, 'ab']<br>[3, 'ab']`-`'xy'=[`NaN`, 'ab']|[3, 5]`-`true=[2, 4]<br>[3, 'abfalse']`-`false=[3, 'ab']|[3, 5]`-`[2, 6]=[1, -1]<br>[3, 5]`-`[3, 'ab']=[0, `NaN`]<br>[3, 'ab5']`-`[3, 5]=[0, 'ab']|`null`|
|Object|{'a': 5, 'b': 'z7'}`-`7={'a': -2, 'b': 'z'}|{'a': 5, 'b': 'xyz'}`-`'yz'={'a': `NaN`, 'b': 'x'}|{'a': 5, 'b': 'z'}`-`true={'a': 4, 'b': 'z'}<br>{'a': 5, 'b': 'zfalse'}`-`false={'a': 5, 'b': 'z'}|`null`|{'a': 5, 'b': 8}`-`{'a': 5, 'b': 'z'}={'a': 0, 'b': `NaN`}<br>{'a': 5, 'b': 'z8'}`-`{'a': 5, 'b': 8}={'a': 0, 'b': 'z'}|











### Multiply operator (`*`)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`*`8=56<br>7`*`-1=-7|7`*`'5'=35<br>7`*`''=0<br>7`*`'xy'=`NaN`|7`*`true=7<br>7`*`false=0|`NaN`|`NaN`|
|String|'xyz'`*`2='xyzxyz'<br>'xyz'`*`0=''<br>'xyz'`*`-1=''|'xyz'`*`'xy'='xy'<br>'xyz'`*`'xz'=''<br>'xyz'`*`''=''|'xyz'`*`true='xyz'<br>'xyz'`*`false=''|''|''|
|Boolean|true`*`7=true<br>true`*`0=false<br>false`*`7=false|true`*`'5'=true<br>true`*`''=false<br>false`*`''=false<br>true`*`'xy'=false|true`*`true=true<br>true`*`false=false<br>false`*`true=false<br>false`*`false=false|false|false|
|Array|[3, 5]`*`7=[21, 35]<br>[3, 'ab']`*`5=[15, 'ababababab']|[3, 5]`*`'5'=[15, 25]<br>[3, 'xyz']`*`'xy'=[`NaN`, 'xy']|[3, 5]`*`true=[3, 5]<br>[3, 'ab']`*`false=[0, '']|[3, 5]`*`[3, 5]=[9, 25]<br>[3, 5]`*`[3, 'ab']=[9, `NaN`]<br>[3, 'ab']`*`[3, 5]=[9, 'ababababab']<br>[3, 'abc']`*`[3, 'ab']=[9, 'ab']|`null`|
|Object|{'a': 5, 'b': 'z'}`*`7={'a': 35, 'b': 'zzzzzzz'}|{'a': 5, 'b': 'z'}`*`'5'={'a': 25, 'b': ''}<br>{'a': 5, 'b': 'xyz'}`*`'xy'={'a': `NaN`, 'b': 'xy'}|{'a': 5, 'b': 'z'}`*`true={'a': 5, 'b': 'z'}<br>{'a': 5, 'b': 'z'}`*`false={'a': 0, 'b': ''}|`null`|{'a': 5, 'b': 8}`*`{'a': 5, 'b': 'z'}={'a': 25, 'b': `NaN`}<br>{'a': 5, 'b': 'z'}`*`{'a': 5, 'b': 8}={'a': 25, 'b': 'zzzzzzzz'}|











### Divide operator (`/`)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|5`/`2=2.5<br>5`/`0=`Infinity`|7`/`'5'=1.4<br>7`/`''=`Infinity`<br>7`/`'xy'=`NaN`|7`/`true=7<br>7`/`false=`Infinity`|`NaN`|`NaN`|
|String|'xyz'`/`3='x'<br>'xyz'`/`0=''<br>'xyz'`/`-1=''|'xyz'`/`'xy'='z'<br>'xyz'`/`'xz'='xyz'<br>'xyz'`/`''=''|'xyz'`/`true='xyz'<br>'xyz'`/`false=''|''|''|
|Boolean|true`/`7=true<br>true`/`0=false<br>false`/`7=false|true`/`'5'=true<br>true`/`''=false<br>false`/`'5'=false<br>true`/`'xy'=false|true`/`true=true<br>true`/`false=false<br>false`/`true=false<br>false`/`false=false|false|false|
|Array|[3, 7]`/`5=[0.6, 1.4]<br>[3, 'xyz']`/`3=[1, 'x']|[3, 5]`/`'5'=[0.6, 1]<br>[3, 'xyz']`/`'xy'=[`NaN`, 'z']|[3, 5]`/`true=[3, 5]<br>[3, 'ab']`/`false=[`Infinity`, '']|[3, 7]`/`[2, 5]=[1.5, 1.4]<br>[3, 5]`/`[2, 'ab']=[1.5, `NaN`]<br>[3, 'xyz']`/`[2, 'xy']=[1.5, 'z']|`null`|
|Object|{'a': 6, 'b': 'xyz'}`/`3={'a': 2, 'b': 'x'}|{'a': 6, 'b': 'xyz'}`/`'xy'={'a': `NaN`, 'b': 'z'}|{'a': 6, 'b': 'xyz'}`/`true={'a': 6, 'b': 'xyz'}<br>{'a': 6, 'b': 'xyz'}`/`false={'a': `Infinity`, 'b': ''}|`null`|{'a': 6, 'b': 8}`/`{'a': 5, 'b': 'xy'}={'a': 1.2, 'b': `NaN`}<br>{'a': 6, 'b': 'xyz'}`/`{'a': 5, 'b': 3}={'a': 1.2, 'b': 'x'}|











### Power operator (`^`)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|5`^`2=25<br>5`^`0=1<br>5`^`-1=0.2|5`^`'2'=25<br>5`^`''=1<br>5`^`'xy'=`NaN`|5`^`true=5<br>5`^`false=1|`NaN`|`NaN`|
|String|'xyz'`^`2='xyz'<br>'xyz'`^`0=''<br>'xyz'`^`-1=''|'xyz'`^`'xz'='xz'<br>'xyz'`^`''=''|'xyz'`^`true='xyz'<br>'xyz'`^`false=''|''|''|
|Boolean|true`^`7=true<br>false`^`7=false<br>false`^`0=true|true`^`'xy'=true<br>false`^`''=true|true`^`true=true<br>true`^`false=true<br>false`^`true=false<br>false`^`false=true|false|false|
|Array|[3, 5]`^`2=[9, 25]<br>[3, 'ab']`^`2=[9, 'ab']|[3, 5]`^`'2'=[9, 25]<br>[3, 'ab']`^`'xy'=[`NaN`, '']|[3, 5]`^`true=[3, 5]<br>[3, 'ab']`^`false=[1, '']|[3, 5]`^`[3, 2]=[27, 25]<br>[3, 5]`^`[3, 'xz']=[27, `NaN`]<br>[3, 'xyz']`^`[3, 'xz']=[27, 'xz']|`null`|
|Object|{'a': 3, 'b': 'xyz'}`^`2={'a': 9, 'b': 'xyz'}|{'a': 3, 'b': 'xyz'}`^`'xz'={'a': `NaN`, 'b': 'xz'}|{'a': 3, 'b': 'xyz'}`^`true={'a': 3, 'b': 'xyz'}<br>{'a': 3, 'b': 'xyz'}`^`false={'a': 1, 'b': ''}|`null`|{'a': 3, 'b': 5}`^`{'a': 2, 'b': 'xz'}={'a': 9, 'b': `NaN`}<br>{'a': 3, 'b': 'xyz'}`^`{'a': 2, 'b': 3}={'a': 9, 'b': 'xyz'}|











### Modulo operator (`%`)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|5`%`2=1<br>5`%`0=`NaN`|5`%`'2'=1<br>5`%`''=`NaN`<br>7`%`'xy'=`NaN`|5`%`true=0<br>5`%`false=`NaN`|`NaN`|`NaN`|
|String|'abcde'`%`3='de'<br>'abcde'`%`0=''|'abcde'`%`'bc'=''<br>'abcde'`%`''=''|'abcde'`%`true=''<br>'abcde'`%`false=''|''|''|
|Boolean|true`%`2=true<br>true`%`1=false<br>true`%`0=false<br>false`%`1=false|true`%`'xy'=false<br>true`%`''=false<br>false`%`'xy'=false|true`%`true=false<br>true`%`false=false<br>false`%`true=false<br>false`%`false=false|false|false|
|Array|[3, 5]`%`3=[0, 2]<br>[3, 'abcde']`%`3=[0, 'de']|[3, 5]`%`'3'=[0, 2]<br>[3, 'abcde']`%`'bc'=[`NaN`, '']|[3, 5]`%`true=[0, 0]<br>[3, 'ab']`%`false=[`NaN`, '']|[3, 5]`%`[2, 3]=[1, 2]<br>[3, 5]`%`[2, 'ab']=[1, `NaN`]<br>[3, 'abced']`%`[2, 'bc']=[1, '']|`null`|
|Object|{'a': 5, 'b': 'abcde'}`%`3={'a': 2, 'b': 'de'}|{'a': 5, 'b': 'abcde'}`%`'bc'={'a': `NaN`, 'b': ''}|{'a': 5, 'b': 'abcde'}`%`true={'a': 0, 'b': ''}|`null`|{'a': 5, 'b': 8}`%`{'a': 3, 'b': 'z'}={'a': 2, 'b': `NaN`}<br>{'a': 5, 'b': 'abcde'}`%`{'a': 3, 'b': 3}={'a': 2, 'b': 'de'}|











### AND operator (&)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|21`&`7=5<br>21`&`-1=21|21`&`'7'=5<br>21`&`'xyz'=`NaN`|21`&`true=1<br>21`&`false=0|`NaN`|`NaN`|
|String|'xyz'`&`1='xyz'<br>'xyz'`&`0=''|'xyz'`&`'z'='xyz'<br>'xyz'`&`''=''|'xyz'`&`true='xyz'<br>'xyz'`&`false=''|''|''|
|Boolean|true`&`2=true<br>true`&`0=false|true`&`'z'=true<br>true`&`''=false|true`&`true=true<br>true`&`false=false<br>false`&`true=false<br>false`&`false=false|false|false|
|Array|[21, 6]`&`7=[5, 6]<br>[21, 'xyz']`&`7=[5, 'xyz']|[21, 6]`&`'7'=[5, 6]<br>[21, 'xyz']`&`'z'=[`NaN`, 'xyz']|[21, 6]`&`true=[1, 0]<br>[21, 'xyz']`&`true=[1, 'xyz']|[21, 11]`&`[7, 10]=[5, 10]<br>[21, 11]`&`[7, 'ab']=[5, `NaN`]<br>[21, 'xyz']`&`[7, 'ab']=[5, 'xyz']|`null`|
|Object|{'a': 21, 'b': 'xyz'}`&`7={'a': 5, 'b': 'xyz'}|{'a': 21, 'b': 'xyz'}`&`'xy'={'a': `NaN`, 'b': 'xyz'}|{'a': 21, 'b': 'xyz'}`&`true={'a': 1, 'b': 'xyz'}<br>{'a': 21, 'b': 'xyz'}`&`false={'a': 0, 'b': ''}|`null`|{'a': 21, 'b': 8}`&`{'a': 7, 'b': 'xyz'}={'a': 5, 'b': `NaN`}<br>{'a': 21, 'b': 'xyz'}`&`{'a': 7, 'b': 8}={'a': 5, 'b': 'xyz'}|











### OR operator (|)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|21`\|`7=23|21`\|`'7'=23<br>21`\|`'xyz'=`NaN`|20`\|`true=21|`NaN`|`NaN`|
|String|''`\|`1=''<br>'xyz'`\|`0='xyz'|''`\|`'z'=''<br>'xyz'`\|`''='xyz'|''`\|`true=''<br>'xyz'`\|`false='xyz'|''|''|
|Boolean|true`\|`0=true<br>false`\|`2=true<br>false`\|`0=false|true`\|`''=true<br>false`\|`'z'=true<br>false`\|`''=false|true`\|`true=true<br>true`\|`false=true<br>false`\|`true=true<br>false`\|`false=false|false|false|
|Array|[21, 6]`\|`7=[23, 7]<br>[21, 'xyz']`\|`7=[23, 'xyz']|[21, 6]`\|`'7'=[23, 7]<br>[21, 'xyz']`\|`'z'=[`NaN`, 'xyz']|[20, 6]`\|`true=[21, 7]<br>[20, 'xyz']`\|`false=[20, 'xyz']|[21, 11]`\|`[7, 5]=[23, 15]<br>[21, 11]`\|`[7, 'z']=[23, `NaN`]<br>[21, 'xyz']`\|`[7, 'z']=[23, 'xyz']|`null`|
|Object|{'a': 21, 'b': 'xyz'}`\|`7={'a': 23, 'b': 'xyz'}|{'a': 21, 'b': 'xyz'}`\|`'z'={'a': `NaN`, 'b': 'xyz'}|{'a': 20, 'b': 'xyz'}`\|`true={'a': 21, 'b': 'xyz'}<br>{'a': 20, 'b': 'xyz'}`\|`false={'a': 20, 'b': 'xyz'}|`null`|{'a': 21, 'b': 6}`\|`{'a': 7, 'b': 'z'}={'a': 23, 'b': `NaN`}<br>{'a': 21, 'b': 'xyz'}`\|`{'a': 7, 'b': 7}={'a': 23, 'b': 'xyz'}|











### XOR operator (~)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|21`~`7=18|21`~`'7'=18<br>21`~`'xyz'=`NaN`|21`~`true=20|`NaN`|`NaN`|
|String|'xyz'`~`7=''<br>'xyz'`~`0='xyz'<br>''`~`0=''|'xyz'`~`'z'=''<br>'xyz'`~`''='xyz'<br>''`~`''=''|'xyz'`~`true=''<br>'xyz'`~`false='xyz'<br>''`~`false=''|''|''|
|Boolean|true`~`7=false<br>true`~`0=true<br>false`~`7=true<br>false`~`0=false|true`~`'z'=false<br>true`~`''=true<br>false`~`'z'=true<br>false`~`''=false|true`~`true=false<br>true`~`false=true<br>false`~`true=true<br>false`~`false=false|false|false|
|Array|[21, 6]`~`7=[18, 1]<br>[21, 'xyz']`~`7=[18, '']|[21, 6]`~`'7'=[18, 1]<br>[21, 'xyz']`~`'z'=[`NaN`, '']|[21, 6]`~`true=[20, 7]<br>[21, 'xyz']`~`false=[21, 'xyz']|[21, 6]`~`[7, 5]=[18, 3]<br>[21, 6]`~`[7, 'z']=[18, `NaN`]<br>[21, 'xyz']`~`[7, 'z']=[18, '']|`null`|
|Object|{'a': 21, 'b': 'xyz'}`~`7={'a': 18, 'b': ''}|{'a': 21, 'b': 'xyz'}`~`'z'={'a': `NaN`, 'b': ''}|{'a': 21, 'b': 'xyz'}`~`true={'a': 20, 'b': ''}<br>{'a': 21, 'b': 'xyz'}`~`false={'a': 21, 'b': 'xyz'}|`null`|{'a': 21, 'b': 6}`~`{'a': 7, 'b': 'z'}={'a': 18, 'b': `NaN`}<br>{'a': 21, 'b': 'z'}`~`{'a': 7, 'b': 8}={'a': 18, 'b': ''}|











### Shift operator (<<)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`<<`2=28|7`<<`'2'=28<br>7`<<`'xyz'=`NaN`|7`<<`true=14<br>7`<<`false=7|`NaN`|`NaN`|
|String|'xyz'`<<`2='xyz  '|'xyz'`<<`'2'='xyz  '<br>'xyz'`<<`'z'=''|'xyz'`<<`true='xyz '<br>'xyz'`<<`false='xyz'|''|''|
|Boolean|true`<<`2=true<br>true`<<`0=true<br>false`<<`2=false|true`<<`'2'=true<br>true`<<`''=true<br>false`<<`'2'=false<br>true`<<`'xy'=false|true`<<`true=true<br>true`<<`false=true<br>false`<<`true=false<br>false`<<`false=false|false|false|
|Array|[3, 5]`<<`2=[12, 20]<br>[3, 'xyz']`<<`2=[12, 'xyz  ']|[3, 5]`<<`'2'=[12, 20]<br>[3, 'xyz']`<<`'z'=[`NaN`, '']|[3, 5]`<<`true=[6, 10]<br>[3, 'xyz']`<<`false=[3, 'xyz']|[3, 5]`<<`[2, 3]=[12, 40]<br>[3, 5]`<<`[2, 'z']=[12, `NaN`]<br>[3, 'xyz']`<<`[2, 'z']=[12, '']|`null`|
|Object|{'a': 3, 'b': 'xyz'}`<<`2={'a': 12, 'b': 'xyz  '}|{'a': 3, 'b': 'xyz'}`<<`'z'={'a': `NaN`, 'b': ''}|{'a': 3, 'b': 'xyz'}`<<`true={'a': 6, 'b': 'xyz '}|`null`|{'a': 3, 'b': 5}`<<`{'a': 2, 'b': 'z'}={'a': 12, 'b': `NaN`}<br>{'a': 3, 'b': 'xyz'}`<<`{'a': 2, 'b': 1}={'a': 12, 'b': 'xyz '}|











### Unshift operator (>>)

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`>>`1=3|7`>>`'1'=3<br>7`>>`'xyz'=`NaN`|7`>>`true=3<br>7`>>`false=7|`NaN`|`NaN`|
|String|'xyz'`>>`1='xy'|'xyz'`>>`'1'='xy'<br>'xyz'`>>`'z'=''|'xyz'`>>`true='xy'<br>'xyz'`>>`false='xyz'|''|''|
|Boolean|true`>>`1=false<br>true`>>`0=true|true`>>`'1'=false<br>true`>>`''=true<br>true`>>`'z'=false|true`>>`true=false<br>true`>>`false=true<br>false`>>`true=false<br>false`>>`false=false|false|false|
|Array|[7, 5]`>>`1=[3, 2]<br>[7, 'xyz']`>>`1=[3, 'xy']|[7, 5]`>>`'1'=[3, 2]<br>[7, 'xyz']`>>`'z'=[`NaN`, '']|[7, 5]`>>`true=[3, 2]<br>[7, 'xyz']`>>`true=[3, 'xy']|[7, 5]`>>`[1, 2]=[3, 1]<br>[7, 5]`>>`[1, 'z']=[3, `NaN`]<br>[7, 'xyz']`>>`[1, 'z']=[3, '']|`null`|
|Object|{'a': 7, 'b': 'xyz'}`>>`1={'a': 3, 'b': 'xy'}|{'a': 7, 'b': 'xyz'}`>>`'z'={'a': `NaN`, 'b': ''}|{'a': 7, 'b': 'xyz'}`>>`true={'a': 3, 'b': 'xy'}|`null`|{'a': 7, 'b': 5}`>>`{'a': 1, 'b': 'z'}={'a': 3, 'b': `NaN`}<br>{'a': 7, 'b': 'xyz'}`>>`{'a': 1, 'b': 2}={'a': 3, 'b': 'x'}|











### Logical NOT operator (`!`)

Logical NOT operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|None|`!`7=false<br>`!`0=true|`!`'xyz'=false<br>`!`''=true|`!`true=false<br>`!`false=true|`!`[3, 5]=false<br>`!`[]=true|`!`{'a': 5, 'b': 8}=false<br>`!`{}=true|













### Logical AND operator (`&&`)

Logical AND operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`&&`8=true<br>7`&&`0=false|7`&&`'xyz'=true<br>7`&&`''=false|7`&&`true=true<br>7`&&`false=false|7`&&`[3, 5]=true<br>7`&&`[]=false|7`&&`{'a': 5, 'b': 'z'}=true<br>7`&&`{}=false|
|String|'xyz'`&&`7=true<br>'xyz'`&&`0=false|'xyz'`&&`'abc'=true<br>'xyz'`&&`''=false|'xyz'`&&`true=true<br>'xyz'`&&`false=false|'xyz'`&&`[3, 5]=true<br>'xyz'`&&`[]=false|'xyz'`&&`{'a': 5, 'b': 'z'}=true<br>'xyz'`&&`{}=false|
|Boolean|true`&&`7=true<br>true`&&`0=false|true`&&`'xyz'=true<br>true`&&`''=false|true`&&`true=true<br>true`&&`false=false<br>false`&&`true=false<br>false`&&`false=false|true`&&`[3, 5]=true<br>true`&&`[]=false|true`&&`{'a': 5, 'b': 'z'}=true<br>true`&&`{}=false|
|Array|[3, 5]`&&`7=true<br>[3, 5]`&&`0=false|[3, 5]`&&`'xyz'=true<br>[3, 5]`&&`''=false|[3, 5]`&&`true=true<br>[3, 5]`&&`false=false|[3, 5]`&&`[2, 3]=true<br>[3, 5]`&&`[]=false|[3, 5]`&&`{'a': 5, 'b': 'z'}=true<br>[3, 5]`&&`{}=false|
|Object|{'a': 5, 'b': 'z'}`&&`7=true<br>{'a': 5, 'b': 'z'}`&&`0=false|{'a': 5, 'b': 'z'}`&&`'xyz'=true<br>{'a': 5, 'b': 'z'}`&&`''=false|{'a': 5, 'b': 'z'}`&&`true=true<br>{'a': 5, 'b': 'z'}`&&`false=false|{'a': 5, 'b': 'z'}`&&`[3, 5]=true<br>{'a': 5, 'b': 'z'}`&&`[]=false|{'a': 5, 'b': 'z'}`&&`{'a': 5, 'b': 'z'}=true<br>{'a': 5, 'b': 'z'}`&&`{}=false|









### Logical OR operator (`||`)

Logical AND operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`\|\|`0=true<br>0`\|\|`0=false|7`\|\|`''=true<br>0`\|\|`''=false|7`\|\|`false=true<br>0`\|\|`false=false|7`\|\|`[]=true<br>0`\|\|`[]=false|7`\|\|`{}=true<br>0`\|\|`{}=false|
|String|'xyz'`\|\|`0=true<br>''`\|\|`0=false|'xyz'`\|\|`''=true<br>''`\|\|`''=false|'xyz'`\|\|`false=true<br>''`\|\|`false=false|'xyz'`\|\|`[]=true<br>''`\|\|`[]=false|'xyz'`\|\|`{}=true<br>''`\|\|`{}=false|
|Boolean|true`\|\|`0=true<br>false`\|\|`0=false|true`\|\|`''=true<br>false`\|\|`''=false|true`\|\|`true=true<br>true`\|\|`false=true<br>false`\|\|`true=true<br>false`\|\|`false=false|true`\|\|`[]=true<br>false`\|\|`[]=false|true`\|\|`{}=true<br>false`\|\|`{}=false|
|Array|[3, 5]`\|\|`0=true<br>[]`\|\|`0=false|[3, 5]`\|\|`''=true<br>[]`\|\|`''=false|[3, 5]`\|\|`false=true<br>[]`\|\|`false=false|[3, 5]`\|\|`[]=true<br>[]`\|\|`[]=false|[3, 5]`\|\|`{}=true<br>[]`\|\|`{}=false|
|Object|{'a': 5, 'b': 'z'}`\|\|`0=true<br>{}`\|\|`0=false|{'a': 5, 'b': 'z'}`\|\|`''=true<br>{}`\|\|`''=false|{'a': 5, 'b': 'z'}`\|\|`false=true<br>{}`\|\|`false=false|{'a': 5, 'b': 'z'}`\|\|`[]=true<br>{}`\|\|`[]=false|{'a': 5, 'b': 'z'}`\|\|`{}=true<br>{}`\|\|`{}=false|









### Logical XOR operator (`~~`)

Logical XOR operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`~~`8=false<br>7`~~`0=true|7`~~`'xyz'=false<br>7`~~`''=true|7`~~`true=false<br>7`~~`false=true|7`~~`[3, 5]=false<br>7`~~`[]=true|7`~~`{'a': 5, 'b': 'z'}=false<br>7`~~`{}=true|
|String|'xyz'`~~`8=false<br>'xyz'`~~`0=true|'xyz'`~~`'z'=false<br>'xyz'`~~`''=true|'xyz'`~~`true=false<br>'xyz'`~~`false=true|'xyz'`~~`[3, 5]=false<br>'xyz'`~~`[]=true|'xyz'`~~`{'a': 5, 'b': 'z'}=false<br>'xyz'`~~`{}=true|
|Boolean|true`~~`8=false<br>true`~~`0=true|true`~~`'z'=false<br>true`~~`''=true|true`~~`true=false<br>true`~~`false=true<br>false`~~`true=true<br>false`~~`false=false|true`~~`[3, 5]=false<br>true`~~`[]=true|true`~~`{'a': 5, 'b': 'z'}=false<br>true`~~`{}=true|
|Array|[3, 5]`~~`8=false<br>[3, 5]`~~`0=true|[3, 5]`~~`'z'=false<br>[3, 5]`~~`''=true|[3, 5]`~~`true=false<br>[3, 5]`~~`false=true|[3, 5]`~~`[3, 5]=false<br>[3, 5]`~~`[]=true|[3, 5]`~~`{'a': 5, 'b': 'z'}=false<br>[3, 5]`~~`{}=true|
|Object|{'a': 5, 'b': 'z'}`~~`8=false<br>{'a': 5, 'b': 'z'}`~~`0=true|{'a': 5, 'b': 'z'}`~~`'z'=false<br>{'a': 5, 'b': 'z'}`~~`''=true|{'a': 5, 'b': 'z'}`~~`true=false<br>{'a': 5, 'b': 'z'}`~~`false=true|{'a': 5, 'b': 'z'}`~~`[3, 5]=false<br>{'a': 5, 'b': 'z'}`~~`[]=true|{'a': 5, 'b': 'z'}`~~`{'a': 5, 'b': 'z'}=false<br>{'a': 5, 'b': 'z'}`~~`{}=true|









### Comparision equal operator (`=`)

Comparision equal operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`=`7=true<br>7`=`0=false|7`=`'7'=true<br>7`=`'xyz'=false|7`=`true=true<br>7`=`false=false<br>0`=`false=true|7`=`[3, 5]=false|7`=`{'a': 5, 'b': 'z'}=false|
|String|'7'`=`7=true<br>'xyz'`=`7=false|'xyz'`=`'xyz'=true<br>'xyz'`=`'abc'=false|'xyz'`=`true=true<br>'xyz'`=`false=false<br>''`=`false=true|'xyz'`=`[3, 5]=false|'xyz'`=`{'a': 5, 'b': 'z'}=false|
|Boolean|true`=`7=true<br>true`=`0=false<br>false`=`0=true|true`=`'xyz'=true<br>true`=`''=false<br>false`=`''=true|true`=`true=true<br>true`=`false=false<br>false`=`true=false<br>false`=`false=true|true`=`[3, 5]=false|true`=`{'a': 5, 'b': 'z'}=false|
|Array|[3, 5]`=`7=false|[3, 5]`=`'xyz'=false|[3, 5]`=`true=false|[3, 5]`=`[3, 5]=true<br>[3, 5]`=`[3, 'ab']=false|[3, 5]`=`{'a': 5, 'b': 'z'}=false|
|Object|{'a': 5, 'b': 'z'}`=`7=false|{'a': 5, 'b': 'z'}`=`'xyz'=false|{'a': 5, 'b': 'z'}`=`true=false|{'a': 5, 'b': 'z'}`=`[3, 5]=false|{'a': 5, 'b': 'z'}`=`{'a': 5, 'b': 'z'}=true<br>{'a': 5, 'b': 'z'}`=`{'a': 5, 'b': 8}=false|









### Comparition not equal operator (`<>`)

Comparision not equal operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`<>`7=false<br>7`<>`0=true|7`<>`'7'=false<br>7`<>`'xyz'=true|7`<>`true=false<br>7`<>`false=true<br>0`<>`false=false|7`<>`[3, 5]=true|7`<>`{'a': 5, 'b': 'z'}=true|
|String|'7'`<>`7=false<br>'xyz'`<>`7=true|'xyz'`<>`'xyz'=false<br>'xyz'`<>`'abc'=true|'xyz'`<>`true=false<br>'xyz'`<>`false=true<br>''`<>`false=false|'xyz'`<>`[3, 5]=true|'xyz'`<>`{'a': 5, 'b': 'z'}=true|
|Boolean|true`<>`7=false<br>true`<>`0=true<br>false`<>`0=false|true`<>`'xyz'=false<br>true`<>`''=true<br>false`<>`''=false|true`<>`true=false<br>true`<>`false=true<br>false`<>`true=true<br>false`<>`false=false|true`<>`[3, 5]=true|true`<>`{'a': 5, 'b': 'z'}=true|
|Array|[3, 5]`<>`7=true|[3, 5]`<>`'xyz'=true|[3, 5]`<>`true=true|[3, 5]`<>`[3, 5]=false<br>[3, 5]`<>`[3, 'ab']=true|[3, 5]`<>`{'a': 5, 'b': 'z'}=true|
|Object|{'a': 5, 'b': 'z'}`<>`7=true|{'a': 5, 'b': 'z'}`<>`'xyz'=true|{'a': 5, 'b': 'z'}`<>`true=true|{'a': 5, 'b': 'z'}`<>`[3, 5]=true|{'a': 5, 'b': 'z'}`<>`{'a': 5, 'b': 'z'}=false<br>{'a': 5, 'b': 'z'}`<>`{'a': 5, 'b': 8}=true|









### Comparision less operator (`<`)

Comparision less operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`<`8=true<br>7`<`7=false|7`<`'8'=true<br>7`<`'xyz'=false|0`<`true=true<br>7`<`true=false|7`<`[3, 5]=false|7`<`{'a': 5, 'b': 'z'}=false|
|String|'5'`<`6=true<br>'xyz'`<`6=false|'xyz'`<`'xzz'=true<br>'xyz'`<`'xyy'=false|''`<`true=true<br>'xyz'`<`true=false|'xyz'`<`[3, 5]=false|'xyz'`<`{'a': 5, 'b': 'z'}=false|
|Boolean|false`<`7=true<br>true`<`7=false|false`<`'xyz'=true<br>true`<`'xyz'=false|true`<`true=false<br>true`<`false=false<br>false`<`true=true<br>false`<`false=false|false`<`[3, 5]=false|false`<`{'a': 5, 'b': 'z'}=false|
|Array|[3, 5]`<`7=false|[3, 5]`<`'xyz'=false|[3, 5]`<`true=false|[3, 5]`<`[4, 6]=true<br>[3, 5]`<`[3, 6]=false|[3, 5]`<`{'a': 5, 'b': 'z'}=false|
|Object|{'a': 5, 'b': 'z'}`<`7=false|{'a': 5, 'b': 'z'}`<`'xyz'=false|{'a': 5, 'b': 'z'}`<`true=false|{'a': 5, 'b': 'z'}`<`[3, 5]=false|{'a': 5, 'b': 'y'}`<`{'a': 6, 'b': 'z'}=true<br>{'a': 5, 'b': 'y'}`<`{'a': 5, 'b': 'z'}=false|









### Comparision greater operator (`>`)

Comparision greater operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`>`6=true<br>7`>`7=false|7`>`'6'=true<br>7`>`'xyz'=false|7`>`false=true<br>7`>`true=false|7`>`[3, 5]=false|7`>`{'a': 5, 'b': 'z'}=false|
|String|'5'`>`4=true<br>'3'`>`4=false|'xyz'`>`'xyy'=true<br>'xyz'`>`'xzz'=false|'xyz'`>`false=true<br>'xyz'`>`true=false|'xyz'`>`[3, 5]=false|'xyz'`>`{'a': 5, 'b': 'z'}=false|
|Boolean|true`>`0=true<br>true`>`1=false|true`>`''=true<br>true`>`'xyz'=false|true`>`true=false<br>true`>`false=true<br>false`>`true=false<br>false`>`false=false|true`>`[3, 5]=false|true`>`{'a': 5, 'b': 'z'}=false|
|Array|[3, 5]`>`0=false|[3, 5]`>`''=false|[3, 5]`>`false=false|[3, 5]`>`[2, 4]=true<br>[3, 5]`>`[2, 5]=false|[3, 5]`>`{'a': 5, 'b': 'z'}=false|
|Object|{'a': 5, 'b': 'z'}`>`0=false|{'a': 5, 'b': 'z'}`>`''=false|{'a': 5, 'b': 'z'}`>`false=false|{'a': 5, 'b': 'z'}`>`[3, 5]=false|{'a': 5, 'b': 'z'}`>`{'a': 4, 'b': 'y'}=true<br>{'a': 5, 'b': 'z'}`>`{'a': 4, 'b': 'z'}=false|









### Comparision less or equal operator (`<=`)

Comparision less or equal operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`<=`7=true<br>7`<=`6=false|7`<=`'7'=true<br>7`<=`'xyz'=false|1`<=`true=true<br>1`<=`false=false|7`<=`[3, 5]=false|7`<=`{'a': 5, 'b': 'z'}=false|
|String|'5'`<=`5=true<br>'5'`<=`4=false|'xyz'`<=`'xyz'=true<br>'xyz'`<=`'xyy'=false|'xyz'`<=`true=true<br>'xyz'`<=`false=false|'xyz'`<=`[3, 5]=false|'xyz'`<=`{'a': 5, 'b': 'z'}=false|
|Boolean|true`<=`1=true<br>true`<=`0=false|true`<=`'xyz'=true<br>true`<=`''=false|true`<=`true=true<br>true`<=`false=false<br>false`<=`true=true<br>false`<=`false=true|true`<=`[3, 5]=false|true`<=`{'a': 5, 'b': 'z'}=false|
|Array|[3, 5]`<=`7=false|[3, 5]`<=`'xyz'=false|[3, 5]`<=`true=false|[3, 5]`<=`[3, 5]=true<br>[3, 5]`<=`[2, 5]=false|[3, 5]`<=`{'a': 5, 'b': 'z'}=false|
|Object|{'a': 5, 'b': 'z'}`<=`7=false|{'a': 5, 'b': 'z'}`<=`'xyz'=false|{'a': 5, 'b': 'z'}`<=`true=false|{'a': 5, 'b': 'z'}`<=`[3, 5]=false|{'a': 5, 'b': 'z'}`<=`{'a': 5, 'b': 'z'}=true<br>{'a': 5, 'b': 'z'}`<=`{'a': 5, 'b': 'y'}=false|









### Comparision greater or equal operator (`>=`)

Comparision greater or equal operator always return boolean result.

|LeftRight|Number|String|Boolean|Array|Object|
|---|---|---|---|---|---|
|Number|7`>=`7=true<br>7`>=`8=false|7`>=`'7'=true<br>7`>=`'xyz'=false|7`>=`true=true<br>0`>=`true=false|7`>=`[]=false|7`>=`{}=false|
|String|'7'`>=`7=true<br>'7'`>=`8=false|'xyz'`>=`'xyz'=true<br>'xyz'`>=`'xzz'=false|'xyz'`>=`true=true<br>'xyz'`>=`false=true|'xyz'`>=`[]=false|'xyz'`>=`{}=false|
|Boolean|true`>=`1=true<br>false`>=`2=false|true`>=`'xyz'=true<br>false`>=`'xyz'=false|true`>=`true=true<br>true`>=`false=true<br>false`>=`true=false<br>false`>=`false=true|true`>=`[3, 5]=false|true`>=`{'a': 5, 'b': 'z'}=false|
|Array|[3, 5]`>=`0=false|[3, 5]`>=`''=false|[3, 5]`>=`false=false|[3, 5]`>=`[3, 5]=true<br>[3, 5]`>=`[3, 6]=false|[3, 5]`>=`{'a': 5, 'b': 'z'}=false|
|Object|{'a': 5, 'b': 'z'}`>=`0=false|{'a': 5, 'b': 'z'}`>=`''=false|{'a': 5, 'b': 'z'}`>=`false=false|{'a': 5, 'b': 'z'}`>=`[]=false|{'a': 5, 'b': 'z'}`>=`{'a': 5, 'b': 'z'}=true<br>{'a': 5, 'b': 'y'}`>=`{'a': 5, 'b': 'z'}=false|
