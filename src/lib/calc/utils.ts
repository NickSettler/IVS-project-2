import { Lexer } from './lexer.ts';
import { Scanner } from './parser.ts';
import { Executor } from './executor.ts';

export const isExpressionValid = (expression: string): boolean => {
  try {
    const lexer = new Lexer(expression);
    new Scanner(lexer.getNextToken.bind(lexer)).processQuery();

    return true;
  } catch (e: any) {
    return false;
  }
};
