export const CODE = {
  'E100': 'Invalid formula',
  'E101': 'Invalid brackets',
  'E102': 'Unmatched brackets',
  'E103': 'Unclosed formula',
  'E104': 'Unchained operand',
  'E105': 'Invalid object key',
  'E106': 'Unclosed object',
  'E201': 'Invalid number',
  'E202': 'Too many commas in number',
  'E203': 'Invalid hex number',
  'E204': 'Invalid binary number',
  'E205': 'Invalid octet number',
  'E206': 'Unclosed string',
  'E301': 'Variable not resolved',
  'E302': 'Formula not resolved',
  'E303': 'Brackets not resolved',
};

export class ParserError extends Error {
  code: string;
  constructor (message, pos, ...params) {
    super(...params);
    this.message = `${message || 'Unknown error'}${pos ? ` at ${pos}` : ''}`;
  }
}

export default {
  ParserError,
  CODE,
}