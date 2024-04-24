import { Lexer, Scanner, Executor } from '../renderer/src/lib/calc';
import { readFileSync } from 'node:fs';

const STDIN_FILENO = 0;

const input = readFileSync(STDIN_FILENO, 'utf-8');

const processedInput: string = input
  .replace(/[\n\s\t\r]/g, ',')
  .replace(/,{2,}/g, ',')
  .replace(/,$/, '');

const calc = (expression: string): string => {
  const lexer = new Lexer(expression);
  const tree = new Scanner(lexer.getNextToken.bind(lexer)).processQuery();
  const executor = new Executor(tree);

  return executor.execute();
};

// eslint-disable-next-line
const expression: string = `stddev([${processedInput}])`;

console.log(calc(expression));
