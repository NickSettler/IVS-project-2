import * as common from './common';

export const enum E_LEXER_STATE {
  START = 'START',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  FUNCTION_STATE = 'FUNCTION_STATE',
}

export type TLexicalToken = {
  type: common.E_TOKEN_TYPE;
  value: string;
  line: number;
  column: number;
  width: number;
};
