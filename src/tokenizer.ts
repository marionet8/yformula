import { Token } from './interface';
import { ParserError, CODE } from './error';
import { OT, TT } from './constant';

const SPACE_CODES = [' ', '\t'].map(x => x.charCodeAt(0));
const ESCAPE_CODES1 = ['\\', '"', '\'', 't', 'a', 'n', 'b', '0'].map((x: string) => x.charCodeAt(0));
const ESCAPE_CODES2 = ['\\', '"', '\'', '\t', '\a', '\n', '\b', '\0'].map((x: string) => x.charCodeAt(0));
const OP_CODES = Object.values(OT);
const OP_CODES1 = OP_CODES.filter((x: number) => x > 0 && x < 128);

const OTHER = 0;
const INTEGER = 1;
const FLOAT = 2;
const HEX = 3;
const BIN = 4;
const OCT = 5;

function _parseNumber (str: string, type: number, idx: number): number|undefined {
  if (type === INTEGER) {
    const num = Number.parseInt(str);
    if (Number.isNaN(num)) {
      throw new ParserError(CODE.E201, idx);
    }
    return num;
  } else if (type === FLOAT) {
    const num = Number.parseFloat(str);
    if (Number.isNaN(num)) {
      if (str.split('.').length > 1) {
        throw new ParserError(CODE.E202, idx);
      } else {
        throw new ParserError(CODE.E201, idx);
      }
    }
    return num;
  } else if (type === HEX) {
    const num = Number.parseInt(str.slice(2), 16);
    if (Number.isNaN(num)) {
      throw new ParserError(CODE.E203, idx);
    }
    return num;
  } else if (type === BIN) {
    const num = Number.parseInt(str.slice(2), 2);
    if (Number.isNaN(num)) {
      throw new ParserError(CODE.E204, idx);
    }
    return num;
  } else if (type === OCT) {
    const num = Number.parseInt(str.slice(2), 8);
    if (Number.isNaN(num)) {
      throw new ParserError(CODE.E205, idx);
    }
    return num;
  }  
}

/**
 * @type function
 * @summary Tokenize formula string main loop
 * @param {string} str formula string
 * @param {number} [idx] cursor index of str
 * @param {number} [ec] end character code
 * @param {number} [dc] delimitter character code
 * @returns {Object} { tokens, idx }
 */
function _tokenize (str: string, idx = 0, ec = 0, dc = 0) {
  const tokens: Token[] = [];
  let buf = '', bidx = 0, fixed = false, ntype = OTHER, otype = OT.NOP, not = false;
  for (let idx1 = idx; idx1 < str.length; idx1++) {
    const cc = str.charCodeAt(idx1);

    if (SPACE_CODES.indexOf(cc) >= 0) {
      if (buf.length > 0) {
        fixed = true;
      }

    } else if (cc === ec || cc === dc) {
      if (buf.length > 0) {
        const _type = ntype === OTHER ? TT.VARIABLE : TT.NUMBER;
        const _name = ntype === OTHER ? buf : undefined;
        const _value = ntype === OTHER ? undefined : _parseNumber(buf, ntype, bidx);
        if (not) {
          tokens.push({ opcode: OT.NOT, for: NaN, type: _type, name: _name, value: _value });
          tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT.REF, ref: -1 });
        } else {
          tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: _type, name: _name, value: _value });
        }
      }
      return { tokens, idx: idx1 };

    } else if ([0x29, 0x7d, 0x5d].indexOf(cc) >= 0) { // ')' '}' ']'
      // console.debug(idx1, cc, ec, dc)
      throw new ParserError(CODE.E102, idx1);

    } else if (cc === 0x28) { // '('
      if (buf.length === 0) {
        const res = _tokenize(str, idx1 + 1, 0x29); // ')'
        if (not) {
          tokens.push({ opcode: OT.NOT, for: NaN, type: TT.BRACKETS, tokens: res.tokens });
          tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT.REF, ref: -1 });
        } else {
          tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: TT.BRACKETS, tokens: res.tokens });
        }
        idx1 = res.idx;
      } else {
        const tokens2: Token[][] = [];
        while (idx1 < str.length && str.charCodeAt(idx1) !== 0x29) {
          const res = _tokenize(str, idx1 + 1, 0x29, 0x2c); // ')' ','
          tokens2.push(res.tokens);
          idx1 = res.idx;
        }
        if (not) {
          tokens.push({ opcode: OT.NOT, for: NaN, type: TT.FUNCTION, name: buf, parameters: tokens2 });
          tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT.REF, ref: -1 });
        } else {
          tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: TT.FUNCTION, name: buf, parameters: tokens2 });
        }
      }
      buf = ''; bidx = 0; fixed = false; ntype = OTHER; otype = OT.NOP; not = false;

    } else if (cc === 0x5b) { // '['
      if (buf.length > 0) {
        throw new ParserError(CODE.E101, idx1);
      }
      if (not) {
        throw new ParserError(CODE.E100, idx1);
      }
      const tokens2: Token[][] = [];
      while (idx1 < str.length && str.charCodeAt(idx1) !== 0x5d) { // ']'
        const res = _tokenize(str, idx1 + 1, 0x5d, 0x2c); // ']' ','
        tokens2.push(res.tokens);
        idx1 = res.idx;
      }
      if (not) {
        tokens.push({ opcode: OT.NOT, for: NaN, type: TT.ARRAY, value: tokens2 });
        tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT.REF, ref: -1 });
      } else {
        tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: TT.ARRAY, value: tokens2 });
      }
      buf = ''; bidx = 0; fixed = false; ntype = OTHER; otype = OT.NOP; not = false;

    } else if (cc === 0x7b) { // '{'
      if (buf.length > 0) {
        throw new ParserError(CODE.E101, idx1);
      }
      if (not) {
        throw new ParserError(CODE.E100, idx1);
      }
      const obj2 = {};
      while (idx1 < str.length && str.charCodeAt(idx1) !== 0x7d) { // '}'
        let keyname;
        const res1 = _tokenize(str, idx1 + 1, 0x7d, 0x3a); // '}' ':'
        if (res1.tokens.length !== 1) {
          throw new ParserError(CODE.E105, idx1 + 1);
        }
        if (res1.tokens[0].type === TT.STRING) {
          keyname = res1.tokens[0].value;
        } else if (res1.tokens[0].type === TT.VARIABLE) {
          keyname = res1.tokens[0].name;
        } else {
          throw new ParserError(CODE.E105, idx1 + 1);
        }
        const res2 = _tokenize(str, res1.idx + 1, 0x7d, 0x2c); // '}' ','
        obj2[keyname] = res2.tokens;
        idx1 = res2.idx;
      }
      if (not) {
        tokens.push({ opcode: OT.NOT, for: NaN, type: TT.OBJECT, value: obj2 });
        tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT.REF, ref: -1 });
      } else {
        tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: TT.OBJECT, value: obj2 });
      }
      buf = ''; bidx = 0; fixed = false; ntype = OTHER; otype = OT.NOP; not = false;

    } else if ([0x22, 0x27].indexOf(cc) >= 0) { // '"' '\''
      if (buf.length > 0) {
        throw new ParserError(CODE.E100, idx1);
      }
      if (not) {
        throw new ParserError(CODE.E100, idx1);
      }
      let cc2 = str.charCodeAt(++idx1);
      while (cc2 !== cc && idx1 < str.length) {
        if (cc2 === 0x5c) { // '\'
          const cc3 = str.charCodeAt(++idx1);
          if (ESCAPE_CODES1.indexOf(cc3) >= 0) {
            buf += ESCAPE_CODES2[ESCAPE_CODES1.indexOf(cc3)];
          }
        } else {
          buf += str.charAt(idx1);
        }
        cc2 = str.charCodeAt(++idx1);
      }
      if (cc2 !== cc) {
        throw new ParserError(CODE.E206, idx1);
      }
      tokens.push({ opcode: otype, for: -1, type: TT.STRING, value: buf });
      buf = ''; bidx = 0; fixed = false; ntype = OTHER; otype = OT.NOP; not = false;

    } else if (cc === 0x21) { // '!'
      if (not) {
        throw new ParserError(CODE.E100, idx1);
      }
      if (buf.length > 0) {
        throw new ParserError(CODE.E100, idx1);
      }
      not = true;

    } else if (OP_CODES1.indexOf(cc) >= 0) {
      if (buf.length > 0) {
        const _type = ntype === OTHER ? TT.VARIABLE : TT.NUMBER;
        const _name = ntype === OTHER ? buf : undefined;
        const _value = ntype === OTHER ? undefined : _parseNumber(buf, ntype, bidx);
        if (not) {
          tokens.push({ opcode: OT.NOT, for: NaN, type: _type, name: _name, value: _value });
          tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT.REF, ref: -1 });
        } else {
          tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: _type, name: _name, value: _value });
        }
        buf = ''; bidx = 0; fixed = false; ntype = OTHER; otype = OT.NOP; not = false;
      }
      const cc2 = cc * 256 + str.charCodeAt(idx1 + 1);
      const cc3 = cc2 * 256 + str.charCodeAt(idx1 + 2);
      if (OP_CODES.indexOf(cc3) >= 0) {
        otype = cc3;
        idx1 += 2;
      } else if (OP_CODES.indexOf(cc2) >= 0) {
        otype = cc2;
        idx1 += 1;
      } else {
        otype = cc;
      }

    } else if (fixed) {
      throw new ParserError(CODE.E100, idx1);

    } else {
      if (buf.length === 0) {
        if (cc >= 0x30 && cc <= 0x39) {
          ntype = INTEGER;
          const cc2 = str.charCodeAt(idx1 + 1);
          if (cc === 0x30) {
            if (cc2 === 0x58 || cc2 === 0x78) { // 'X' 'x'
              ntype = HEX; idx1++;
            } else if (cc2 === 0x42 || cc2 === 0x62) { // 'B' 'b'
              ntype = BIN; idx1++;
            } else if (cc2 === 0x4f || cc2 === 0x6f) { // 'O' 'o'
              ntype = OCT; idx1++;
            }  
          }
        }
        bidx = idx1;
      } else if (ntype === INTEGER && cc === 0x2e) { // '.'
        ntype = FLOAT;
      } else if ((ntype === INTEGER || ntype === FLOAT) && !(cc >= 0x30 && cc <= 0x39)) { // '0'-'9'
        ntype = OTHER;
      } else if (ntype === HEX && !((cc >= 0x30 && cc <= 0x39) || (cc >= 0x41 && cc <= 0x46) || (cc >= 0x61 && cc <= 0x66))) { // '0'-'9'/'A'-'F'/'a'-'f'
        ntype = OTHER;
      } else if (ntype === BIN && !(cc >= 0x30 && cc <= 0x31)) { // '0'-'1'
        ntype = OTHER;
      } else if (ntype === OCT && !(cc >= 0x30 && cc <= 0x37)) { // '0'-'7'
        ntype = OTHER;
      } 
      buf += str.charAt(idx1);
    }
  }
  if (ec > 0) {
    throw new ParserError(CODE.E103, str.length);
  }
  if (buf.length > 0) {
    const _type = ntype === OTHER ? TT.VARIABLE : TT.NUMBER;
    const _name = ntype === OTHER ? buf : undefined;
    const _value = ntype === OTHER ? undefined : _parseNumber(buf, ntype, bidx);
    if (not) {
      tokens.push({ opcode: OT.NOT, for: NaN, type: _type, name: _name, value: _value });
      tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -2, type: TT.REF, ref: -1 });
    } else {
      tokens.push({ opcode: otype, for: otype === OT.NOP ? NaN : -1, type: _type, name: _name, value: _value });
    }
  }
  return { tokens, idx: str.length };
}

/**
 * @type function
 * @summary Tokenize formula string
 * @param {string} str formula string
 * @returns {Array} tokens
 */
export function tokenize (str) {
  const tokenized = _tokenize(str);
  return tokenized.tokens;
}

export default {
  tokenize,
}