import { Lexer } from './lexer.ts';
import { Scanner } from './parser.ts';

/**
 * Check if the expression is valid
 * @param {string} expression The expression to check
 * @returns {boolean} True if the expression is valid, false otherwise
 */
export const isExpressionValid = (expression: string): boolean => {
  try {
    const lexer = new Lexer(expression);
    new Scanner(lexer.getNextToken.bind(lexer)).processQuery();

    return true;
  } catch (e: any) {
    return false;
  }
};
