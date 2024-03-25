import { entries, map } from 'lodash';
import { Lexer, TLexicalToken, E_TOKEN_TYPE } from '../src/lib/calc';

describe('Lexer tests', () => {
  const check = (input: string, expected: Array<Partial<TLexicalToken>>) => {
    const lexicalAnalyser = new Lexer(input);
    let token: TLexicalToken = lexicalAnalyser.getNextToken();
    let i = 0;

    while (token.type !== E_TOKEN_TYPE.EOF) {
      const expectedToken = expected[i];

      if (expectedToken === undefined)
        // eslint-disable-next-line prettier/prettier
        throw new Error('Expected token doesn\'t exist');

      console.log(token, expected[i]);

      expect(token).toEqual(
        expect.objectContaining<Partial<TLexicalToken>>({
          ...expected[i],
        }),
      );

      token = lexicalAnalyser.getNextToken();
      i += 1;
    }
  };

  const testsSets: Record<
    string,
    Record<string, Array<Partial<TLexicalToken>>>
  > = {
    Empty: {
      '     ': [],
      '\t  \t \n\r\r   ': [],
      '  \n\n\r\t\t\0': [{ type: E_TOKEN_TYPE.EOF, value: '' }],
    },
    Numbers: {
      1: [{ type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' }],
      123: [{ type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '123' }],
      '12 34': [
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '12' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '34' },
      ],
    },
    Brackets: {
      '(': [{ type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' }],
      ')': [{ type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' }],
      '(())': [
        { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
        { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
        { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
        { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
      ],
    },
    Sequences: {
      '1 + 2': [
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
        { type: E_TOKEN_TYPE.PLUS, value: '+' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '1 - 2': [
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
        { type: E_TOKEN_TYPE.MINUS, value: '-' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '1*-2': [
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
        { type: E_TOKEN_TYPE.MULTIPLY, value: '*' },
        { type: E_TOKEN_TYPE.MINUS, value: '-' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '1 / 2': [
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
        { type: E_TOKEN_TYPE.DIVIDE, value: '/' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '1 % 2': [
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
        { type: E_TOKEN_TYPE.MODULO, value: '%' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '1^2': [
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
        { type: E_TOKEN_TYPE.POWER, value: '^' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '1+2!': [
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
        { type: E_TOKEN_TYPE.PLUS, value: '+' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.FACTORIAL, value: '!' },
      ],
      'sqrtn(10 * 3 * 2 + 2^(sqrt(2)^2), 6 / 2) + sin(D2R(10+20+30+10*3)) + round(4^cos(3.1415*2)) + abs(-1) + 3!':
        [
          { type: E_TOKEN_TYPE.FUNCTION, value: 'sqrtn' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '10' },
          { type: E_TOKEN_TYPE.MULTIPLY, value: '*' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
          { type: E_TOKEN_TYPE.MULTIPLY, value: '*' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
          { type: E_TOKEN_TYPE.PLUS, value: '+' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
          { type: E_TOKEN_TYPE.POWER, value: '^' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'sqrt' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.POWER, value: '^' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '6' },
          { type: E_TOKEN_TYPE.DIVIDE, value: '/' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.PLUS, value: '+' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'sin' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'D2R' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '10' },
          { type: E_TOKEN_TYPE.PLUS, value: '+' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '20' },
          { type: E_TOKEN_TYPE.PLUS, value: '+' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '30' },
          { type: E_TOKEN_TYPE.PLUS, value: '+' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '10' },
          { type: E_TOKEN_TYPE.MULTIPLY, value: '*' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.PLUS, value: '+' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'round' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4' },
          { type: E_TOKEN_TYPE.POWER, value: '^' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'cos' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3.1415' },
          { type: E_TOKEN_TYPE.MULTIPLY, value: '*' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.PLUS, value: '+' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'abs' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.MINUS, value: '-' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.PLUS, value: '+' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
          { type: E_TOKEN_TYPE.FACTORIAL, value: '!' },
        ],
      'diff(union(intersect(union(difference([1,2,33,3], [3]), [4,5]), [1,2]), [3, 9]), [1])':
        [
          { type: E_TOKEN_TYPE.FUNCTION, value: 'diff' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'union' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'intersect' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'union' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.FUNCTION, value: 'difference' },
          { type: E_TOKEN_TYPE.OPEN_PAREN, value: '(' },
          { type: E_TOKEN_TYPE.SQUARE_OPEN_PAREN, value: '[' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '33' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
          { type: E_TOKEN_TYPE.SQUARE_CLOSE_PAREN, value: ']' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.SQUARE_OPEN_PAREN, value: '[' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
          { type: E_TOKEN_TYPE.SQUARE_CLOSE_PAREN, value: ']' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.SQUARE_OPEN_PAREN, value: '[' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '5' },
          { type: E_TOKEN_TYPE.SQUARE_CLOSE_PAREN, value: ']' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.SQUARE_OPEN_PAREN, value: '[' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
          { type: E_TOKEN_TYPE.SQUARE_CLOSE_PAREN, value: ']' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.SQUARE_OPEN_PAREN, value: '[' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '9' },
          { type: E_TOKEN_TYPE.SQUARE_CLOSE_PAREN, value: ']' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
          { type: E_TOKEN_TYPE.COMMA, value: ',' },
          { type: E_TOKEN_TYPE.SQUARE_OPEN_PAREN, value: '[' },
          { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
          { type: E_TOKEN_TYPE.SQUARE_CLOSE_PAREN, value: ']' },
          { type: E_TOKEN_TYPE.CLOSE_PAREN, value: ')' },
        ],
    },
  };

  map(entries(testsSets), ([setName, tests]) => {
    describe(setName, () => {
      map(entries(tests), ([input, expected]) => {
        test(input, () => {
          check(input, expected);
        });
      });
    });
  });
});
