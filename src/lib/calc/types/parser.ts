import { E_TOKEN_TYPE } from './common';

/**
 * Syntax token attribute type. Used to store token attributes and parse expressions.
 */
export type TSyntaxTokenAttribute = {
  /**
   * Token type.
   */
  type: E_TOKEN_TYPE;
  /**
   * Trait if the token is right associative (e.g. power operator).
   */
  isRightAssociative: boolean;
  /**
   * Trait if the token is binary (e.g. plus, minus, multiply, divide, etc.).
   */
  isBinary: boolean;
  /**
   * Trait if the token is unary (e.g. negate, factorial, etc.).
   */
  isUnary: boolean;
  /**
   * Precedence of the token.
   */
  precedence: number;
};
