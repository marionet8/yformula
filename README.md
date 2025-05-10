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

# Usage

## Install

```
$ npm install yformula
```

## Quick start

### Server
```
const { Option, Parser, Evaluator, evaluate } = require('yformula');

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
const option = Option();
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
    evaluated(yformula.Option({ operator: new yformula.Operator() })).then(result => {
        document.getElementById('evaluate_answer').value = result; // output 35.5
    });
</script>
```

<br>

# [API Reference](doc/API.md)

(Link available only homepage)

<br>

# Appendix

## [Performance](doc/Performance.md)

(Link available only homepage)

## [Specification of operators](doc/Operator.md)

(Link available only homepage)
