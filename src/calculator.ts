import { Token, Option } from './interface';
import { ParserError, CODE } from './error';
import $c from './constant';
import { Operator, _operator, operate } from './operation.js';

const { OT, TT, OTPRIO, VAR, FUNC } = $c;

const varCache = {}; // {name: value}
const funcCache = {}; // {name: [{parameters, value}]}

function _toString (value) {
  if (Array.isArray(value)) {
    return '[' + value.map(x => _toString(x)).join(', ') + ']';
  } else if (value instanceof Object) {
    return '{' + Object.keys(value).map(x => `'${x}': ${_toString(value[x])}`).join(', ') + '}';
  } else if (typeof value === 'string') {
    return `'${value}'`;
  } else if (typeof value === 'undefined') {
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

function _asToken (value: any): Token {
  const token: Token = { type: TT.UNKNOWN, value };
  if (typeof value === 'number') {
    token.type = TT.NUMBER;
  } else if (typeof value === 'string') {
    token.type = TT.STRING;
  } else if (typeof value === 'boolean') {
    token.type = TT.BOOLEAN;
  } else if (Array.isArray(value)) {
    token.type = TT.ARRAY;
  } else if (value instanceof Object) {
    token.type = TT.OBJECT;
  }
  return token;
}

async function _resolve (tokens: Token[], option: Option, idx: number, results: Token[], refs: number[]): Promise<Token> {
  if (!isNaN(refs[idx])) {
    return results[refs[idx]];

  } else if (tokens[idx].type === TT.REF) {
    const ridx = isNaN(tokens[idx].ref!) ? NaN : tokens[idx].ref! >= 0 ? tokens[idx].ref! : idx + tokens[idx].ref! >= 0 ? idx + tokens[idx].ref! : NaN;
    return await _resolve(tokens, option, ridx, results, refs);

  } else if (tokens[idx].type === TT.ARRAY) {
    for (let vi = 0; vi < tokens[idx].value!.length; vi++) {
      const calculated = await _calculate(tokens[idx].value![vi], option);
      tokens[idx].value![vi] = calculated.length > 0 ? calculated[calculated.length - 1].value : NaN;
    }
    return tokens[idx];

  } else if (tokens[idx].type === TT.OBJECT) {
    const obj = {};
    const keys = Object.keys(tokens[idx].value!);
    for (let ki = 0; ki < keys.length; ki++) {
      const calculated = await _calculate(tokens[idx].value[keys[ki]], option);
      obj[keys[ki]] = calculated.length > 0 ? calculated[calculated.length - 1].value : NaN;
    }
    tokens[idx].value! = obj;
    return tokens[idx];

  } else if (tokens[idx].type === TT.VARIABLE) {
    if (option.cache && tokens[idx].name! in varCache) {
      return varCache[tokens[idx].name!];
    }
    let value: Token = { type: TT.UNKNOWN };
    if (typeof option.callVariable === 'function') {
      value = _asToken(await option.callVariable(tokens[idx].name, option.argument));
    }
    if (value.type === TT.UNKNOWN) {
      if (option.variable instanceof Object && tokens[idx].name! in option.variable) {
        if (option.variable[tokens[idx].name!] instanceof Function) {
          value = _asToken(await option.variable[tokens[idx].name!](option.argument));
        } else {
          value = _asToken(option.variable[tokens[idx].name!]);
        }
      } else if (tokens[idx].name! in VAR) {
        value = _asToken(VAR[tokens[idx].name!]);
      }
    }
    if (value.type !== TT.UNKNOWN) {
      if (option.cache) {
        varCache[tokens[idx].name!] = value;
      }
    }
    return value;

  } else if (tokens[idx].type === TT.FUNCTION) {
    const parameters: any[] = [];
    for (let pi = 0; pi < tokens[idx].parameters!.length; pi++) {
      const calculated = await _calculate(tokens[idx].parameters![pi], option);
      parameters.push(calculated.length > 0 ? calculated[calculated.length - 1].value : NaN);
    }
    if (option.cache && tokens[idx].name! in funcCache) {
      for (let ci = 0; ci < funcCache[tokens[idx].name!].length; ci++) {
        if (_operator.equal(funcCache[tokens[idx].name!][ci].parameters, parameters)) {
          return funcCache[tokens[idx].name!][ci].value;
        }
      }
    }
    let value: Token = { type: TT.UNKNOWN };
    if (typeof option.callFunction === 'function') {
      value = _asToken(await option.callFunction(tokens[idx].name, parameters, option.argument));
    }
    if (value.type === TT.UNKNOWN) {
      if (option.function instanceof Object && tokens[idx].name! in option.function) {
        value = _asToken(await option.function[tokens[idx].name!](parameters, option.argument));
      } else if (tokens[idx].name! in FUNC) {
        value = _asToken(FUNC[tokens[idx].name!](...parameters));
      }
    }
    if (value.type !== TT.UNKNOWN) {
      if (option.cache) {
        if (!funcCache[tokens[idx].name!]) {
          funcCache[tokens[idx].name!] = [];
        }
        funcCache[tokens[idx].name!].push({ parameters, value });
      }
    }
    return value;

  } else if (tokens[idx].type === TT.BRACKETS) {
    const calculated = await _calculate(tokens[idx].tokens!, option);
    return calculated.length > 0 ? calculated[calculated.length - 1] : { type: TT.UNKNOWN, value: NaN };

  } else {
    return tokens[idx];
  }
}

function _resolveAsCode (tokens: Token[], idx: number, results: string[], refs: number[]): string {
  if (!isNaN(refs[idx])) {
    return `results[${refs[idx]}]`;

  } else if (tokens[idx].type === TT.REF) {
    const ridx = isNaN(tokens[idx].ref!) ? NaN : tokens[idx].ref! >= 0 ? tokens[idx].ref! : idx + tokens[idx].ref! >= 0 ? idx + tokens[idx].ref! : NaN;
    return _resolveAsCode(tokens, ridx, results, refs);

  } else if (tokens[idx].type === TT.ARRAY) {
    const values: string[] = [];
    for (let vi = 0; vi < tokens[idx].value!.length; vi++) {
      const calculated = _calculateAsCode(tokens[idx].value![vi]);
      if (calculated.length > 0) {
        const lines: string[] = [];
        lines.push(`const results = Array(${calculated.length}).fill(NaN);`)
        lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
        lines.push(`return results[${calculated.length - 1}].value;`);
        values.push(`await (async () => { ${lines.join(' \n')} })()`);
      } else {
        values.push(`NaN`);
      }
    }
    return `_asToken([${values.join(', ')}])`;

  } else if (tokens[idx].type === TT.OBJECT) {
    const values: string[] = [];
    const keys = Object.keys(tokens[idx].value!);
    for (let ki = 0; ki < keys.length; ki++) {
      const calculated = _calculateAsCode(tokens[idx].value[keys[ki]]);
      if (calculated.length > 0) {
        const lines: string[] = [];
        lines.push(`const results = Array(${calculated.length}).fill(NaN);`)
        lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
        lines.push(`return results[${calculated.length - 1}].value;`);
        values.push(`['${keys[ki]}', await (async () => { ${lines.join(' \n')} })()]`)
      } else {
        values.push(`['${keys[ki]}', NaN]`)
      }
    }
    return `_asToken(Object.fromEntries([${values.join(', ')}]))`;

  } else if (tokens[idx].type === TT.VARIABLE) {
    const lines: string[] = [];
    lines.push(`let value;`);
    lines.push(`if (option.callVariable instanceof Function) {`);
    lines.push(`  value = await option.callVariable('${tokens[idx].name}', option.argument);`);
    lines.push(`}`);
    lines.push(`if (value === null || value === undefined) {`);
    lines.push(`  if (option.variable instanceof Object && '${tokens[idx].name}' in option.variable) {`);
    lines.push(`    if (option.variable['${tokens[idx].name}'] instanceof Function) {`);
    lines.push(`      value = await option.variable['${tokens[idx].name}'](option.argument);`);
    lines.push(`    } else {`);
    lines.push(`      value = option.variable['${tokens[idx].name}'];`);
    lines.push(`    }`);
    lines.push(`  } else if ('${tokens[idx].name}' in VAR) {`);
    lines.push(`    value = VAR['${tokens[idx].name}'];`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(`return value;`);
    return `_asToken(await (async () => { ${lines.join(' \n')} })())`;

  } else if (tokens[idx].type === TT.FUNCTION) {
    const args: string[] = [];
    for (let pi = 0; pi < tokens[idx].parameters!.length; pi++) {
      const calculated = _calculateAsCode(tokens[idx].parameters![pi]);
      if (calculated.length > 0) {
        const lines: string[] = [];
        lines.push(`const results = Array(${calculated.length}).fill(NaN);`)
        lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
        lines.push(`return results[${calculated.length - 1}].value;`);
        args.push(`await (async () => { ${lines.join(' \n')} })()`);
      } else {
        args.push(`NaN`);
      }
    }
    const lines: string[] = [];
    lines.push(`let value;`);
    lines.push(`if (option.callFunction instanceof Function) {`);
    lines.push(`  value = await option.callFunction('${tokens[idx].name}', [${args.join(', ')}], option.argument);`);
    lines.push(`}`);
    lines.push(`if (value === null || value === undefined) {`);
    lines.push(`  if (option.function instanceof Object && '${tokens[idx].name}' in option.function) {`);
    lines.push(`    value = await option.function['${tokens[idx].name}']([${args.join(', ')}], option.argument);`);
    lines.push(`  } else if ('${tokens[idx].name}' in FUNC) {`);
    lines.push(`    value = FUNC['${tokens[idx].name}'](${args.join(', ')});`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(`return value;`);
    return `_asToken(await (async () => { ${lines.join(' \n')} })())`;

  } else if (tokens[idx].type === TT.BRACKETS) {
    const calculated = _calculateAsCode(tokens[idx].tokens!);
    if (calculated.length > 0) {
      const lines: string[] = [];
      lines.push(`const results = Array(${calculated.length}).fill(NaN);`)
      lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
      lines.push(`return results[${calculated.length - 1}].value;`);
      return `_asToken(await (async () => { ${lines.join(' \n')} })())`;
    } else {
      return `_asToken(NaN)`;
    }

  } else {
    return _toString(tokens[idx]);
  }
}

async function _calculate_main (tokens: Token[], option: Option, idx: number, results: Token[], refs: number[]): Promise<void> {
  const fidx = isNaN(tokens[idx].for!) ? NaN : tokens[idx].for! >= 0 ? tokens[idx].for! : idx + tokens[idx].for! >= 0 ? idx + tokens[idx].for! : NaN;
  // let fval: Token|null, cval: Token;
  const fval = isNaN(fidx) ? null : await _resolve(tokens, option, fidx, results, refs);
  const cval = await _resolve(tokens, option, idx, results, refs);
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
}

function _calculateAsCode_main (tokens: Token[], idx: number, results: string[], refs: number[]): void {
  const fidx = isNaN(tokens[idx].for!) ? NaN : tokens[idx].for! >= 0 ? tokens[idx].for! : idx + tokens[idx].for! >= 0 ? idx + tokens[idx].for! : NaN;
  // let fval: string|null, cval: string;
  const fval = isNaN(fidx) ? null : _resolveAsCode(tokens, fidx, results, refs);
  const cval = _resolveAsCode(tokens, idx, results, refs);
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

async function _calculate (tokens: Token[], option: Option): Promise<Token[]> {
  const results: Token[] = [];
  const refs = Array(tokens.length).fill(NaN);
  if (tokens.length > 1) {
    for (let oi = 0; oi < OTPRIO.length; oi++) {
      if (OTPRIO[oi].dir > 0) {
        for (let ti = 0; ti < tokens.length; ti++) {
          if (OTPRIO[oi].types.indexOf(tokens[ti].opcode!) < 0) { continue }
          await _calculate_main(tokens, option, ti, results, refs);
        }
      } else {
        for (let ti = tokens.length - 1; ti >= 0; ti--) {
          if (OTPRIO[oi].types.indexOf(tokens[ti].opcode!) < 0) { continue }
          await _calculate_main(tokens, option, ti, results, refs);
        }
      }
    }
  } else if (tokens.length === 1) {
    results.push(await _resolve(tokens, option, 0, results, refs));
    refs[0] = 0;
  }
  return results;
}

function _calculateAsCode (tokens: Token[]): string[] {
  const results: string[] = [];
  const refs = Array(tokens.length).fill(NaN);
  if (tokens.length > 1) {
    for (let oi = 0; oi < OTPRIO.length; oi++) {
      if (OTPRIO[oi].dir > 0) {
        for (let ti = 0; ti < tokens.length; ti++) {
          if (OTPRIO[oi].types.indexOf(tokens[ti].opcode!) < 0) { continue }
          _calculateAsCode_main(tokens, ti, results, refs);
        }
      } else {
        for (let ti = tokens.length - 1; ti >= 0; ti--) {
          if (OTPRIO[oi].types.indexOf(tokens[ti].opcode!) < 0) { continue }
          _calculateAsCode_main(tokens, ti, results, refs);
        }
      }
    }
  } else if (tokens.length === 1) {
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
export async function calculate (tokens: Token[], option: Option): Promise<any> {
  const calculated: Token[] = await _calculate(tokens, option);
  return calculated.length > 0 ? calculated[calculated.length - 1].value! : NaN;
}

/**
 * @type function
 * @summary Code formula tokens
 * @param {Array} tokens Formula tokens
 * @returns {string} Coded result
 */
export function code (tokens: Token[]): string {
  const calculated = _calculateAsCode(tokens);
  const lines: string[] = [];
  if (calculated.length > 0) {
    lines.push(`(async (option) => {`);
    lines.push(...Object.keys($c).filter(x => ['FUNC'].indexOf(x) < 0).map(x => `const ${x} = ${JSON.stringify($c[x])};`));
    lines.push(`const FUNC = { ${Object.keys(FUNC).map(x => `${x}: Math.${FUNC[x].name}`).join(', ')} }`)
    // lines.push(Operator.toString());
    // lines.push(`const _operator = new Operator();`);
    lines.push(operate.toString());
    lines.push(_asToken.toString());
    lines.push(`const results = Array(${calculated.length}).fill(NaN);`)
    lines.push(...calculated.map((x, i) => `results[${i}] = ${x};`));
    lines.push(`return results[${calculated.length - 1}].value;`);
    lines.push(`})`);
    return lines.join('\n');
  } else {
    return `(option) => NaN`;
  }
}

export default {
  calculate,
  code,
}