import { Lexer, Scanner, Executor } from '../src/renderer/src/lib/calc';

const input = 'intersect([1], [2])';

const calc = (expression: string): string => {
  const lexer = new Lexer(expression);
  const tree = new Scanner(lexer.getNextToken.bind(lexer)).processQuery();
  const executor = new Executor(tree);

  return executor.execute();
};

console.log(calc(input));
