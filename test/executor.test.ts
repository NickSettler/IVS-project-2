import { TScannerTestToken } from './parser.test.ts';
import {
  E_SYNTAX_TREE_TRAVERSE_ORDER,
  E_TOKEN_TYPE,
  Executor,
  Lexer,
  Scanner,
} from '../src/renderer/src/lib/calc';
import { map, pick } from 'lodash';

describe('Executor tests', () => {
  const check = (
    input: string,
    expected: Array<Partial<TScannerTestToken>>,
  ): void => {
    const lexer = new Lexer(input);
    const scanner = new Scanner(lexer.getNextToken.bind(lexer));

    const tree = scanner.processQuery();

    const executor = new Executor(tree);
    executor.execute();

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
    Expressions: {
      '2 + 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4' },
      ],
      '2 - 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0' },
      ],
      '2 * .5': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      '5 / 2.5': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      '2 ^ 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4' },
      ],
      '5 % 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      '5!': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '120' },
      ],
    },
    'Complex Expressions': {
      '2 + 2 * 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '6' },
      ],
      '(2 + 2) * 2': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '8' },
      ],
      '3! + 4!': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '30' },
      ],
      '2 ^2*3 + sqrt(4)- sqrt( 9) +1': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '12' },
      ],
    },
    'Number Functions': {
      'abs(-1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'abs(1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'ceil(1.1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      'ceil(1.9)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      'floor(1.1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'floor(1.9)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'round(1.1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'round(1.9)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      'sqrt(4)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      'sqrt(9)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
      ],
      'sqrtn(27, 3)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
      ],
    },
    'Trigonometry Functions': {
      'sin(D2R(R2D(D2R(90))))': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'cos(0)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'tan(0)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0' },
      ],
      'ctg(D2R(30))': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1.7320508075688774' },
      ],
      'cot(D2R(30))': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1.7320508075688774' },
      ],
      'acos(1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0' },
      ],
      'asin(1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1.5707963267948966' },
      ],
      'atan(1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0.7853981633974483' },
      ],
      'acot(1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0.7853981633974483' },
      ],
      'actg(1)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0.7853981633974483' },
      ],
    },
    'Set Functions': {
      '[]': [{ type: E_TOKEN_TYPE.NODE }, { type: E_TOKEN_TYPE.SET }],
      '[1,2,3]': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.SET },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'union([], [3,4,5])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.SET },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '5' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
      ],
      'union([1,2,3], [3,4,5])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.SET },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '5' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'intersect([1,2,3], [])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.SET },
      ],
      'intersect([1,2,3] ,[3, 2,4,5 ] )': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.SET },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      'difference([1,2,3], [3, 2,4,5])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.SET },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'diff([1,2,3], [])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.SET },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
        { type: E_TOKEN_TYPE.SET_ITEM },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
    },
    'Statistics Functions': {
      'sum([])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0' },
      ],
      'sum([1,2,3, 4])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '10' },
      ],
      'sum([3, -3, 4, -4])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0' },
      ],
      'min([-2,1, 0])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '-2' },
      ],
      'max([-2,1, 0])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'count([1,2,3, 4,5,6, 7,     9])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '8' },
      ],
      'count([])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0' },
      ],
      'mean([1,2,3, 4,5,6, 7,     9])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4.625' },
      ],
      'mean([])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '0' },
      ],
      'median([1,2,3, 4,5])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
      ],
      'median([1,2,3, 4,5,6])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3.5' },
      ],
      'mode([1,2,3, 4,5,6, 7, 7, 7, 9])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '7' },
      ],
      'mode([9,1,2,9,3, 4,5,6, 7, 7, 7, 9, 9])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '9' },
      ],
      'range([1,2,3, 4,5,6, 7, 7, 7, 9])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '8' },
      ],
      'range([1,-4,13,80])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '84' },
      ],
      'var([1,2,3, 4,5])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2' },
      ],
      'variance([1,2,3, 4,5,6])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2.9166666666666665' },
      ],
      'stddev([1,2,3, 4,5])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1.5811388300841898' },
      ],
      'stddev([1,2,3, 4,5,6])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1.8708286933869707' },
      ],
      'MAD([1,2,3,4])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1' },
      ],
      'MAD([1,2,3,4,5,6])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '1.5' },
      ],
      'RMS([1,2,3,4])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '2.7386127875258306' },
      ],
      'RMS([1,2,3,4,5,6])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3.8944404818493075' },
      ],
      'min([1,2,3]) + max([1,2,3])': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '4' },
      ],
      'sqrt((min([1,2,3]) + count([1,2,3])) * max([-1, .9, 2.25]))': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL, value: '3' },
      ],
    },
    'Random Functions': {
      'rand()': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL },
      ],
      'randint(1, 2)': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL },
      ],
      'randn(mean([1,2,3,4]), stddev([1,2,3,4]))': [
        { type: E_TOKEN_TYPE.NODE },
        { type: E_TOKEN_TYPE.NUMBER_LITERAL },
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
    test('Invalid function name', () => {
      expect(() => check('invalid()', [])).toThrow();
    });

    test('Wrong set function argument', () => {
      expect(() => check('sum(1)', [])).toThrow();
    });

    test('Wrong number of arguments', () => {
      expect(() => check('sum([], [])', [])).toThrow();
    });

    test('Wrong numeric function argument', () => {
      expect(() => check('abs([])', [])).toThrow();
    });
  });
});
