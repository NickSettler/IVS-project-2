import * as common from './common';

/**
 * Lexer states enumeration.
 * @enum
 */
export const enum E_LEXER_STATE {
  /**
   * Start state. The initial state of the lexer. The lexer returns to this state after processing a token.
   */
  START = 'START',
  /**
   * Number state. The state in which the lexer processes a number token.
   */
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  /**
   * Function state. The state in which the lexer processes a function token.
   */
  FUNCTION_STATE = 'FUNCTION_STATE',
}

/**
 * Lexical token type.
 */
export type TLexicalToken = {
  /**
   * Token type.
   */
  type: common.E_TOKEN_TYPE;
  /**
   * Token value.
   */
  value: string;
  /**
   * Token line number.
   */
  line: number;
  /**
   * Token column number.
   */
  column: number;
  /**
   * Token width.
   */
  width: number;
};
