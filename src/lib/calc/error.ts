import { E_ERROR_CODES } from './types/errors';
import { TLexicalToken } from './types/lexer';

export class LexicalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LexicalError';
  }
}

export class SyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyntaxError';
  }
}

export class ExecutorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExecutorError';
  }
}

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

export const unexpectedSyntaxTokenError = (token: TLexicalToken): never => {
  throw new SyntaxError(
    `Unexpected token: "${token.value}" [${token.type}] at line ${token.line}:${token.column}`,
  );
};
