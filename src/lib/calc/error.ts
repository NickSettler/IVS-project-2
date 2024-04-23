import { E_ERROR_CODES } from './types/errors';

/**
 * Lexical error class
 * @class
 * @classdesc Error class for lexical errors. It is thrown when lexer encounters an error (e.g. unexpected token).
 * @extends Error
 */
export class LexicalError extends Error {
  /**
   * Error constructor
   * @constructor
   * @param {string} message Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'LexicalError';
  }
}

/**
 * Syntax error class
 * @class
 * @classdesc Error class for syntax errors. It is thrown when parser encounters an error (e.g. unexpected token).
 * @extends Error
 */
export class SyntaxError extends Error {
  /**
   * Error constructor
   * @constructor
   * @param {string} message Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'SyntaxError';
  }
}

/**
 * Executor error class
 * @class
 * @classdesc Error class for executor errors. It is thrown when executor encounters an error (e.g. unknown function).
 * @extends Error
 */
export class ExecutorError extends Error {
  /**
   * Error constructor
   * @constructor
   * @param {string} message Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'ExecutorError';
  }
}

/**
 * Error function. Throws an error based on the error code.
 * @param {E_ERROR_CODES} code
 * @param {string} message
 */
export const error = (code: E_ERROR_CODES, message: string): never => {
  switch (code) {
    case E_ERROR_CODES.LEXICAL_ERROR:
      throw new LexicalError(message);
    case E_ERROR_CODES.SYNTAX_ERROR:
      throw new SyntaxError(message);
    case E_ERROR_CODES.EXECUTOR_ERROR:
      throw new ExecutorError(message);
    default:
      throw new Error(message);
  }
};
