import { Token, Option } from './interface';
import { ParserError, CODE } from './error';
import { OT, TT, OTPRIO, VAR, FUNC } from './constant';
import { _operator, operate } from './operation.js';

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

function _processArray (tokens: Token[], option: Option, idx: number): any {
  const values: Token[][] = [];
  for (let vi = 0; vi < tokens[idx].value!.length; vi++) {
    values.push(_optimize(tokens[idx].value![vi], option));
  }
  return values;
}

function _processObject (tokens: Token[], option: Option, idx: number): any {
  const obj = {};
  const keys = Object.keys(tokens[idx].value);
  for (let ki = 0; ki < keys.length; ki++) {
    obj[keys[ki]] = _optimize(tokens[idx].value[keys[ki]], option);
  }
  return obj;
}

function _solveArray (token: Token) {
  if (token.value.filter(x => !(x.length === 1 && x[0].type > TT.UNKNOWN && x[0].type < 10)).length > 0) {
    token.type = TT.UNKNOWN;
  } else {
    token.value = token.value.map(x => x[0].value);
  }
}

function _solveObject (token: Token) {
  const keys = Object.keys(token.value);
  const obj = {};
  let isfixed = true;
  for (let ki = 0; ki < keys.length && isfixed; ki++) {
    if (token.value[keys[ki]].length !== 1) {
      isfixed = false;
    } else if (token.value[keys[ki]][0].type <= TT.UNKNOWN && token.value[keys[ki]][0].type >= 10) {
      isfixed = false;
    } else {
      obj[keys[ki]] = token.value[keys[ki]][0].value;
    }
  }
  if (!isfixed) {
    token.type = TT.UNKNOWN;
  } else {
    token.value = obj;
  }
}

function _optimize_main (tokens: Token[], option: Option, idx: number, prio: number, results: Token[], refs: number[]): number {
  // add tokens of 'for' and solve next index of 'for'.
  // fidx: index of 'for'
  // nfidx: next index of 'for'
  const fidx = isNaN(tokens[idx].for!) ? NaN : tokens[idx].for! >= 0 ? tokens[idx].for! : idx + tokens[idx].for! >= 0 ? idx + tokens[idx].for! : NaN;
  let nfidx = NaN;
  if (!isNaN(fidx)) {
    if (!isNaN(refs[fidx])) {
      // consider about refs as next index of 'for'.
      nfidx = refs[fidx];

    } else if (tokens[fidx].type === TT.REF) {
      // consider about REF as self loop.
      const ridx = isNaN(tokens[fidx].ref!) ? NaN : tokens[fidx].ref! >= 0 ? tokens[fidx].ref! : fidx + tokens[fidx].ref! >= 0 ? fidx + tokens[fidx].ref! : NaN;
      nfidx = _optimize_main(tokens, option, ridx, prio, results, refs);

    } else if (tokens[fidx].type === TT.ARRAY) {
      results.push({ opcode: OT.NOP, for: NaN, type: TT.ARRAY, value: _processArray(tokens, option, fidx) });
      nfidx = results.length - 1;

    } else if (tokens[fidx].type === TT.OBJECT) {
      results.push({ opcode: OT.NOP, for: NaN, type: TT.OBJECT, value: _processObject(tokens, option, fidx) });
      nfidx = results.length - 1;

    } else if (tokens[fidx].type === TT.VARIABLE) {
      if (tokens[fidx].name! in VAR) {
        const token: Token = { opcode: OT.NOP, for: NaN, type: TT.NUMBER, value: VAR[tokens[fidx].name!] };
        if (typeof token.value === 'string') {
          token.type = TT.STRING;
        } else if (typeof token.value === 'boolean') {
          token.type = TT.BOOLEAN;
        } else if (Array.isArray(token.value)) {
          token.type = TT.ARRAY;
        } else if (token.value instanceof Object) {
          token.type = TT.OBJECT;
        }
        results.push(token);
        nfidx = results.length - 1;
      } else {
        results.push(Object.assign({}, tokens[fidx], { opcode: OT.NOP, for: NaN }));
        nfidx = results.length - 1;
      }

    } else if (tokens[fidx].type === TT.FUNCTION) {
      // consider about FUNCTION as deeply loop.
      const parameters: Token[][] = [];
      for (let pi = 0; pi < tokens[fidx].parameters!.length; pi++) {
        parameters.push(_optimize(tokens[fidx].parameters![pi], option));
      }
      results.push({ opcode: OT.NOP, for: NaN, type: TT.FUNCTION, name: tokens[fidx].name, parameters: parameters });
      nfidx = results.length - 1;

    } else if (tokens[fidx].type === TT.BRACKETS) {
      // consider about BRACKETS as deeply loop.
      const _tokens = _optimize(tokens[fidx].tokens!, option);
      if (_tokens.length > 1) {
        results.push({ opcode: OT.NOP, for: NaN, type: TT.BRACKETS, tokens: _tokens });
      } else if (_tokens.length === 1) {
        results.push({ opcode: OT.NOP, for: NaN, type: _tokens[0].type, value: _tokens[0].value });
      } else {
        results.push({ opcode: OT.NOP, for: NaN, type: TT.UNKNOWN, value: null });
      }
      nfidx = results.length - 1;

    } else {
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
      results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT.REF, ref: refs[idx] });
      nridx = results.length - 1;
    } else {
      nridx = refs[idx];
    }

  } else if (tokens[idx].type === TT.REF) {
    // consider about REF as self loop.
    const ridx = isNaN(tokens[idx].ref!) ? NaN : tokens[idx].ref! >= 0 ? tokens[idx].ref! : idx + tokens[idx].ref! >= 0 ? idx + tokens[idx].ref! : NaN;
    results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT.REF, ref: _optimize_main(tokens, option, ridx, prio, results, refs) });
    nridx = results.length - 1;

  } else if (tokens[idx].type === TT.ARRAY) {
    results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT.ARRAY, value: _processArray(tokens, option, idx) });
    nridx = results.length - 1;

  } else if (tokens[idx].type === TT.OBJECT) {
    results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT.OBJECT, value: _processObject(tokens, option, idx) });
    nridx = results.length - 1;

  } else if (tokens[idx].type === TT.VARIABLE) {
    if (tokens[idx].name! in VAR) {
      const token = Object.assign({}, tokens[idx], { for: nfidx, type: TT.NUMBER, value: VAR[tokens[idx].name!] });
      if (typeof token.value === 'string') {
        token.type = TT.STRING;
      } else if (typeof token.value === 'boolean') {
        token.type = TT.BOOLEAN;
      } else if (Array.isArray(token.value)) {
        token.type = TT.ARRAY;
      } else if (token.value instanceof Object) {
        token.type = TT.OBJECT;
      }
      results.push(token);
      nridx = results.length - 1;
    } else {
      results.push(Object.assign({}, tokens[idx], { for: nfidx }));
      nridx = results.length - 1;
    }

  } else if (tokens[idx].type === TT.FUNCTION) {
    // consider about FUNCTION as deeply loop.
    const parameters: Token[][] = [];
    for (let pi = 0; pi < tokens[idx].parameters!.length; pi++) {
      parameters.push(_optimize(tokens[idx].parameters![pi], option));
    }
    results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT.FUNCTION, name: tokens[idx].name, parameters: parameters });
    nridx = results.length - 1;

  } else if (tokens[idx].type === TT.BRACKETS) {
    // consider about BRACKETS as deeply loop.
    const _tokens = _optimize(tokens[idx].tokens!, option);
    if (_tokens.length > 1) {
      results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT.BRACKETS, tokens: _tokens });
    } else if (_tokens.length === 1) {
      results.push({ opcode: tokens[idx].opcode, for: nfidx, type: _tokens[0].type, value: _tokens[0].value });
    } else {
      results.push({ opcode: tokens[idx].opcode, for: nfidx, type: TT.UNKNOWN, value: null });
    }
    nridx = results.length - 1;

  } else {
    results.push(Object.assign({}, tokens[idx], { for: nfidx }));
    nridx = results.length - 1;
  }
  // results.forEach((x, i) => console.debug('AAAAA', i, x));

  // preprocess if possible
  if (!isNaN(nridx)) {
    const zridx = results[nridx].type !== TT.REF ? nridx : isNaN(results[nridx].ref!) ? NaN : results[nridx].ref! >= 0 ? results[nridx].ref! : idx + results[nridx].ref! >= 0 ? idx + results[nridx].ref! : NaN;
    if (!isNaN(zridx)) {
      if (zridx === nridx || results[zridx].opcode === OT.NOP) {
        const rtoken = Object.assign({}, results[nridx], { type: results[zridx].type, value: results[zridx].value });
        if (rtoken.type === TT.ARRAY) {
          _solveArray(rtoken);
        } else if (rtoken.type === TT.OBJECT) {
          _solveObject(rtoken);
        }
        if (rtoken.type > TT.UNKNOWN && rtoken.type < 10) {
          if (rtoken.opcode === OT.NOT) {
            const operated = operate(null, rtoken, OT.NOT, option.operator || _operator);
            results[nridx].opcode = OT.NOP;
            results[nridx].type = operated.type;
            results[nridx].value = operated.value;
            results[nridx].ref = NaN;
          } else if (rtoken.opcode !== OT.NOP) {
            if (!isNaN(nfidx)) {
              const zfidx = results[nfidx].type !== TT.REF ? nfidx : isNaN(results[nfidx].ref!) ? NaN : results[nfidx].ref! >= 0 ? results[nfidx].ref! : idx + results[nfidx].ref! >= 0 ? idx + results[nfidx].ref! : NaN;
              if (!isNaN(zfidx)) {
                const ftoken = Object.assign({}, results[nfidx], { type: results[zfidx].type, value: results[zfidx].value });
                if (ftoken.opcode === OT.NOP || OTPRIO.slice(0, prio).filter(x => x.types.indexOf(ftoken.opcode!) >= 0).length === 0) {
                  if (ftoken.type === TT.ARRAY) {
                    _solveArray(ftoken);
                  } else if (ftoken.type === TT.OBJECT) {
                    _solveObject(ftoken);
                  }
                  if (ftoken.type > TT.UNKNOWN && ftoken.type < 10) {
                    const operated = operate(ftoken, rtoken, rtoken.opcode, option.operator || _operator);
                    results[nfidx].type = operated.type;
                    if (operated.type === TT.ARRAY) {
                      results[nfidx].value = operated.value.map(x => [_asToken(x)]);
                    } else if (operated.type === TT.OBJECT) {
                      const obj = {};
                      const keys = Object.keys(operated.value);
                      for (let ki = 0; ki < keys.length; ki++) {
                        obj[keys[ki]] = [_asToken(operated.value[keys[ki]])];
                      }
                      results[nfidx].value = obj;
                    } else {
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

function _optimize (tokens: Token[], option: Option): Token[] {
  const results: Token[] = [];
  const refs = Array(tokens.length).fill(NaN);

  // call optimizer main by order of opcode priority
  if (tokens.length > 1) {
    for (let oi = 0; oi < OTPRIO.length; oi++) {
      if (OTPRIO[oi].dir > 0) {
        for (let ti = 0; ti < tokens.length; ti++) {
          if (OTPRIO[oi].types.indexOf(tokens[ti].opcode!) < 0) { continue }
          _optimize_main(tokens, option, ti, oi, results, refs);
        }
      } else {
        for (let ti = tokens.length - 1; ti >= 0; ti--) {
          if (OTPRIO[oi].types.indexOf(tokens[ti].opcode!) < 0) { continue }
          _optimize_main(tokens, option, ti, oi, results, refs);
        }
      }
    }
  } else if (tokens.length === 1) {
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
        if (results[tj].for! > ti) {
          results[tj].for = results[tj].for! - 1;
        }
        if (results[tj].ref! > ti) {
          results[tj].ref = results[tj].ref! - 1;
        }
      }
      for (let ri = 0; ri < refs.length; ri++) {
        if (refs[ri] === ti) {
          refs[ri] = NaN;
        } else if (refs[ri] > ti) {
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
export function optimize (tokens, option) {
  const optimized = _optimize(tokens, option);
  return optimized;
}

export default {
  optimize,
}