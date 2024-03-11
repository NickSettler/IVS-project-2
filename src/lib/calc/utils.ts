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

export const isExpressionComputable = (expression: string): boolean => {
  try {
    const lexer = new Lexer(expression);
    const tree = new Scanner(lexer.getNextToken.bind(lexer)).processQuery();
    const executor = new Executor(tree);
    executor.execute();

    return true;
  } catch (e: any) {
    return false;
  }
};
