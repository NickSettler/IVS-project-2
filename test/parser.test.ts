import {
  E_SYNTAX_TREE_TRAVERSE_ORDER,
  E_TOKEN_TYPE,
  Lexer,
  Scanner,
  SyntaxError,
  TAbstractSyntaxTree,
} from '../src/renderer/src/lib/calc';
import { map, pick } from 'lodash';

export type TScannerTestToken = {
  type: TAbstractSyntaxTree['type'];
  value: TAbstractSyntaxTree['value'];
};

describe('Parser tests', () => {
  const check = (
    input: string,
    expected: Array<Partial<TScannerTestToken>>,
  ): void => {
    const lexer = new Lexer(input);
    const scanner = new Scanner(lexer.getNextToken.bind(lexer));

    const tree = scanner.processQuery();

    const preOrderTokens: Array<TScannerTestToken> = [];

    tree.traverseTree(
      (node) =>
        preOrderTokens.push(pick(node, ['left', 'right', 'type', 'value'])),
      E_SYNTAX_TREE_TRAVERSE_ORDER.PRE_ORDER,
    );

    expect(preOrderTokens.length).toBe(expected.length);

    for (let i = 0; i < expected.length; i++) {
      expect(preOrderTokens[i]).toMatchObject(expected[i]);
    }
  };

  const tests: Record<
    string,
    Record<string, Array<Partial<TScannerTestToken>>>
  > = {
    Empty: {
      '': [{ type: E_TOKEN_TYPE.NODE }],
      '\n  \t  \n': [{ type: E_TOKEN_TYPE.NODE }],
    },
    Literals: {
      '12': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '12' },
      ],
      '12.34': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '12.34' },
      ],
      '-12.34': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NEGATE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '12.34' },
      ],
    },
    'Simple Expressions': {
      '2 + 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.PLUS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '2 - 2.23': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.MINUS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2.23' },
      ],
      '2.1 * 2.23': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.MULTIPLY },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2.1' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2.23' },
      ],
      '2.1 / 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.DIVIDE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2.1' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '2 ^ 3': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.POWER },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
      ],
      '7 % 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.MODULO },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '7' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '5!!!!': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.FACTORIAL },
        { type: E_TOKEN_TYPE.FACTORIAL },
        { type: E_TOKEN_TYPE.FACTORIAL },
        { type: E_TOKEN_TYPE.FACTORIAL },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '5' },
      ],
    },
    Functions: {
      'cos(90)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'cos' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '90' },
      ],
      'cos(sin(90))': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'cos' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'sin' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '90' },
      ],
      'cos(90) ^ 2 + sin(90) ^ 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.PLUS },
        { type: E_TOKEN_TYPE.POWER },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'cos' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '90' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.POWER },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'sin' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '90' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      'randn(1, 2)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'randn' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'rand()': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'rand' },
      ],
    },
    'Complex Expressions': {
      '2 + 2 * 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.PLUS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.MULTIPLY },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '(2 + 2) * 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.MULTIPLY },
        { type: E_TOKEN_TYPE.PLUS },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
    },
    Sets: {
      'sum([])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'sum' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.SET },
      ],
      'sum([1,2,3, 4])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.FUNCTION },
        { type: E_TOKEN_TYPE.FUNCTION_NAME, value: 'sum' },
        { type: E_TOKEN_TYPE.FUNCTION_ARGS },
        { type: E_TOKEN_TYPE.SET },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
    },
  };

  map(tests, (testSet, testSetName) => {
    describe(testSetName, () => {
      map(testSet, (expected, input) => {
        it(input, () => {
          check(input, expected);
        });
      });
    });
  });

  describe('Errors', () => {
    test('Unknown start operator', () => {
      expect(() => check('*2', [])).toThrow(SyntaxError);
    });

    test('Unexpected expression token', () => {
      expect(() => check('2 +', [])).toThrow(
        new SyntaxError('Expected expression on line 0/0:0, got ""'),
      );
    });

    test('No function args', () => {
      expect(() => check('cos', [])).toThrow(
        new SyntaxError('Expecting OPEN_PAREN, got '),
      );
    });
  });
});
