import { TAbstractSyntaxTree } from './ast';
import { E_SYNTAX_TREE_TRAVERSE_ORDER } from './types/ast';
import { E_TOKEN_TYPE } from './types/common';
import { error } from './error';
import { E_ERROR_CODES } from './types/errors';
import { E_EXECUTOR_FUNCTION_NAMES } from './types/executor';
import { groupBy, sortBy } from 'lodash';

/**
 * Executor class.
 * @class
 * @classdesc Used to traverse the abstract syntax tree and execute the expression stored in it.
 * @property {TAbstractSyntaxTree} syntaxTree Abstract syntax tree
 */
export class Executor {
  /**
   * Arithmetic operations map. Used to map arithmetic token types to operations.
   * @type {Partial<Record<E_TOKEN_TYPE, (val1: number, val2: number) => number>}
   * @private
   * @static
   * @readonly
   */
  private static readonly ARITHMETIC_MAP: Partial<
    Record<E_TOKEN_TYPE, (val1: number, val2: number) => number>
  > = {
    [E_TOKEN_TYPE.PLUS]: (val1, val2) => val1 + val2,
    [E_TOKEN_TYPE.MINUS]: (val1, val2) => val1 - val2,
    [E_TOKEN_TYPE.MULTIPLY]: (val1, val2) => val1 * val2,
    [E_TOKEN_TYPE.DIVIDE]: (val1, val2) => val1 / val2,
    [E_TOKEN_TYPE.POWER]: (val1, val2) => val1 ** val2,
    [E_TOKEN_TYPE.MODULO]: (val1, val2) => val1 % val2,
  };

  /**
   * Unary operations map. Used to map unary token types to operations.
   * @type {Partial<Record<E_TOKEN_TYPE, (val: number) => number>}
   * @private
   * @static
   * @readonly
   */
  private static readonly UNARY_MAP: Partial<
    Record<E_TOKEN_TYPE, (val: number) => number>
  > = {
    [E_TOKEN_TYPE.NEGATE]: (val) => -val,
    [E_TOKEN_TYPE.FACTORIAL]: (val) => {
      let result = 1;

      for (let i = 2; i <= val; i++) {
        result *= i;
      }

      return result;
    },
  };

  /**
   * Set operations map. Used to map set function names to operations.
   * @type {Partial<Record<E_EXECUTOR_FUNCTION_NAMES, (...sets: Array<Array<number>>) => Array<number> | number>}
   * @private
   * @static
   * @readonly
   */
  private static readonly SET_MAP: Partial<
    Record<
      E_EXECUTOR_FUNCTION_NAMES,
      (...sets: Array<Array<number>>) => Array<number> | number
    >
  > = {
    /**
     * Returns the union of two sets
     * @param set1 set
     * @param set2 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.UNION]: (set1, set2) =>
      Array.from(new Set([...set1, ...set2])),
    /**
     * Returns the intersection of two sets
     * @param set1 set
     * @param set2 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.INTERSECT]: (set1, set2) =>
      set1.filter((value) => set2.includes(value)),
    /**
     * Returns the difference of two sets
     * @param set1 set
     * @param set2 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.DIFFERENCE]: (set1, set2) =>
      set1.filter((value) => !set2.includes(value)),
    /**
     * Returns the difference of a set
     * @param set1 set
     * @param set2 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.DIFF]: (set1, set2) =>
      set1.filter((value) => !set2.includes(value)),
    /**
     * Returns the sum of a set
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.SUM]: (set1) =>
      set1.reduce((acc, value) => acc + value, 0),
    /**
     * Returns the minimum value of a set
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.MIN]: (set1) => Math.min(...set1),
    /**
     * Returns the maximum value of a set
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.MAX]: (set1) => Math.max(...set1),
    /**
     * Returns the number of elements in a set
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.COUNT]: (set1) => set1.length,
    /**
     * Returns the mean value of a set
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.MEAN]: (set1) =>
      set1.reduce((acc, value) => acc + value, 0) / (set1.length || 1),
    /**
     * Returns the median value of a set
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.MEDIAN]: (set1) => {
      const sorted = set1.sort((a, b) => a - b);
      const half = Math.floor(sorted.length / 2);

      if (sorted.length % 2) {
        return sorted[half];
      }

      return (sorted[half - 1] + sorted[half]) / 2.0;
    },
    /**
     * Returns the mode value of a set (the most common value)
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.MODE]: (set1) => {
      if (set1.length === 0) return 0;
      return sortBy(groupBy(set1), (arr) => arr.length).pop()![0];
    },
    /**
     * Returns the range of a set (the difference between the maximum and minimum values)
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.RANGE]: (set1) =>
      Math.max(...set1) - Math.min(...set1),
    /**
     * Returns the variance of a set (the average of the squared differences from the mean)
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.VARIANCE]: (set1) => {
      const mean = this.SET_MAP.mean!(set1) as number;
      return (
        set1.reduce((acc, value) => acc + (value - mean) ** 2, 0) / set1.length
      );
    },
    /**
     * Returns the variance of a set (the average of the squared differences from the mean)
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.VAR]: (set1) => {
      const mean = this.SET_MAP.mean!(set1) as number;
      return (
        set1.reduce((acc, value) => acc + (value - mean) ** 2, 0) / set1.length
      );
    },
    /**
     * Returns the standard deviation of a set (the square root of the variance)
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.STDDEV]: (set1) => {
      const mean = this.SET_MAP.mean!(set1) as number;
      return Math.sqrt(
        set1.reduce((acc, value) => acc + (value - mean) ** 2, 0) /
          (set1.length - 1),
      );
    },
    /**
     * Returns the mean absolute deviation of a set (the average of the absolute differences from the mean)
     * @param set1
     */
    [E_EXECUTOR_FUNCTION_NAMES.MAD]: (set1) => {
      const mean = this.SET_MAP.mean!(set1) as number;
      return (
        set1.reduce((acc, value) => acc + Math.abs(value - mean), 0) /
        set1.length
      );
    },
    /**
     * Returns the root-mean-square of a set (the square root of the average of the squared values)
     * @param set1 set
     */
    [E_EXECUTOR_FUNCTION_NAMES.RMS]: (set1) =>
      Math.sqrt(set1.reduce((acc, value) => acc + value ** 2, 0) / set1.length),
  };

  /**
   * Functions map. Used to map function names to operations.
   * @type {Partial<Record<E_EXECUTOR_FUNCTION_NAMES, (...args: Array<number>) => number>}
   * @private
   * @static
   * @readonly
   */
  private static readonly FUNCTIONS_MAP: Partial<
    Record<E_EXECUTOR_FUNCTION_NAMES, (...args: Array<number>) => number>
  > = {
    // Number functions
    /**
     * Returns the absolute value of a number
     * @param val value
     */
    [E_EXECUTOR_FUNCTION_NAMES.ABS]: Math.abs,
    /**
     * Returns the smallest integer greater than or equal to a number
     * @param val value
     */
    [E_EXECUTOR_FUNCTION_NAMES.CEIL]: Math.ceil,
    /**
     * Returns the largest integer less than or equal to a number
     * @param val value
     */
    [E_EXECUTOR_FUNCTION_NAMES.FLOOR]: Math.floor,
    /**
     * Returns the value of a number rounded to the nearest integer
     * @param val value
     */
    [E_EXECUTOR_FUNCTION_NAMES.ROUND]: Math.round,

    // Trigonometric functions
    /**
     * Returns the sine of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.SIN]: Math.sin,
    /**
     * Returns the cosine of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.COS]: Math.cos,
    /**
     * Returns the tangent of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.TAN]: Math.tan,
    /**
     * Returns the cotangent of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.COT]: (val) => 1 / Math.tan(val),
    /**
     * Returns the cotangent of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.CTG]: (val) => 1 / Math.tan(val),
    /**
     * Returns the arcsine of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.ASIN]: Math.asin,
    /**
     * Returns the arccosine of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.ACOS]: Math.acos,
    /**
     * Returns the arctangent of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.ATAN]: Math.atan,
    /**
     * Returns the arccotangent of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.ACOT]: (val) => Math.PI / 2 - Math.atan(val),
    /**
     * Returns the arccotangent of a number
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.ACTG]: (val) => Math.PI / 2 - Math.atan(val),
    /**
     * Converts radians to degrees
     * @param val value in radians
     */
    [E_EXECUTOR_FUNCTION_NAMES.R2D]: (val) => (val * 180) / Math.PI,
    /**
     * Converts degrees to radians
     * @param val value in degrees
     */
    [E_EXECUTOR_FUNCTION_NAMES.D2R]: (val) => (val * Math.PI) / 180,

    /**
     * Returns the square root of a number
     */
    [E_EXECUTOR_FUNCTION_NAMES.SQRT]: Math.sqrt,
    /**
     * Returns the n-th root of a number
     * @param val value
     * @param n root
     */
    [E_EXECUTOR_FUNCTION_NAMES.SQRTN]: (val, n) => Math.pow(val, 1 / n),

    /**
     * Returns a random number between 0 and 1
     */
    [E_EXECUTOR_FUNCTION_NAMES.RAND]: () => Math.random(),
    /**
     * Returns a random integer
     * @param min minimum value
     * @param max maximum value
     */
    [E_EXECUTOR_FUNCTION_NAMES.RANDINT]: (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min),
    /**
     * Returns a random number from a normal distribution
     * @param mean mean value
     * @param stdDev standard deviation
     */
    [E_EXECUTOR_FUNCTION_NAMES.RANDN]: (mean, stdDev) => {
      let u = 0;
      let v = 0;

      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();

      return (
        mean + stdDev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
      );
    },
  };

  /**
   * Executor constructor.
   * @constructor
   * @param {TAbstractSyntaxTree} syntaxTree Abstract syntax tree
   */
  constructor(private readonly syntaxTree: TAbstractSyntaxTree) {
    //
  }

  /**
   * Parses a number literal from a tree node. Used to perform negate operation on a node.
   * @private
   * @param {TAbstractSyntaxTree} node Tree node
   * @returns {number} Parsed number
   */
  private parseNumberLiteral(node: TAbstractSyntaxTree): number {
    if (
      node.type !== E_TOKEN_TYPE.NUMBER_LITERAL &&
      node.type !== E_TOKEN_TYPE.NEGATE
    ) {
      error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid number literal');
    }

    if (node.type === E_TOKEN_TYPE.NEGATE) {
      const value = node.left?.value;

      if (!value || isNaN(parseFloat(value))) {
        error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid negate number literal');
        throw new Error('Invalid negate number literal');
      }

      return -parseFloat(value);
    }

    if (!node.value) {
      error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid number literal');
      throw new Error('Invalid number literal');
    }

    return parseFloat(node.value);
  }

  /**
   * Prepares the result of the expression. Used to validate the resulting tree and convert it to a string.
   * @private
   * @returns {string} Result string
   */
  private prepareResult(): string {
    if (
      this.syntaxTree.right?.type !== E_TOKEN_TYPE.NUMBER_LITERAL &&
      this.syntaxTree.right?.type !== E_TOKEN_TYPE.SET
    ) {
      error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid result');
      return '';
    }

    if (
      this.syntaxTree.right?.type === E_TOKEN_TYPE.NUMBER_LITERAL &&
      this.syntaxTree.right?.value
    ) {
      return JSON.parse(this.syntaxTree.right.value);
    }

    if (this.syntaxTree.right?.type === E_TOKEN_TYPE.SET) {
      const result = Array<number>();

      this.syntaxTree.right.traverseTree((node) => {
        if (node.type === E_TOKEN_TYPE.SET_ITEM) {
          if (!node.left) {
            error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid set item value');
            return;
          }

          result.push(this.parseNumberLiteral(node.left));
        }
      }, E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER);

      return `[${result.join(', ')}]`;
    }

    return '';
  }

  /**
   * Executes the expression stored in the abstract syntax tree using post-order traversal and existing operation maps.
   * @returns {string | undefined} Result string
   * @throws {@link ExecutorError} if the executor encounters an error (e.g. unknown function)
   */
  public execute(): any {
    this.syntaxTree.traverseTree((node) => {
      if (Executor.ARITHMETIC_MAP[node.type]) {
        const operation = Executor.ARITHMETIC_MAP[node.type];

        if (
          node.left?.type !== E_TOKEN_TYPE.NUMBER_LITERAL &&
          node.right?.type !== E_TOKEN_TYPE.NUMBER_LITERAL &&
          node.left?.type !== E_TOKEN_TYPE.NEGATE &&
          node.right?.type !== E_TOKEN_TYPE.NEGATE
        ) {
          error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid arithmetic tree');
          return;
        }

        if (!operation || !node.left || !node.right) {
          error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid operation');
          return;
        }

        const result = operation(
          this.parseNumberLiteral(node.left),
          this.parseNumberLiteral(node.right),
        );

        node.value = JSON.stringify(result);
        node.type = E_TOKEN_TYPE.NUMBER_LITERAL;
        node.left = undefined;
        node.right = undefined;
      }

      if (Executor.UNARY_MAP[node.type]) {
        const operation = Executor.UNARY_MAP[node.type];

        if (
          node.left?.type !== E_TOKEN_TYPE.NUMBER_LITERAL &&
          node.left?.type !== E_TOKEN_TYPE.NEGATE
        ) {
          error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid arithmetic tree');
          return;
        }

        if (!operation || !node.left) {
          error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid operation');
          return;
        }

        const result = operation(this.parseNumberLiteral(node.left));

        node.value = JSON.stringify(result);
        node.type = E_TOKEN_TYPE.NUMBER_LITERAL;
        node.left = undefined;
        node.right = undefined;
      }

      if (node.type === E_TOKEN_TYPE.FUNCTION) {
        const functionName =
          node.left?.type === E_TOKEN_TYPE.FUNCTION_NAME
            ? node.left?.value
            : undefined;

        if (
          !functionName ||
          (!Executor.FUNCTIONS_MAP[functionName as E_EXECUTOR_FUNCTION_NAMES] &&
            !Executor.SET_MAP[functionName as E_EXECUTOR_FUNCTION_NAMES])
        ) {
          error(
            E_ERROR_CODES.EXECUTOR_ERROR,
            `Invalid function name "${functionName}"`,
          );
          return;
        }

        const isSetFunction =
          !!Executor.SET_MAP[functionName as E_EXECUTOR_FUNCTION_NAMES];
        const isNumberFunction =
          !!Executor.FUNCTIONS_MAP[functionName as E_EXECUTOR_FUNCTION_NAMES];

        if (isNumberFunction) {
          const operation =
            Executor.FUNCTIONS_MAP[functionName as E_EXECUTOR_FUNCTION_NAMES];

          if (!operation) {
            error(
              E_ERROR_CODES.EXECUTOR_ERROR,
              `Invalid function "${functionName}" operation`,
            );
            return;
          }

          const args: Array<number> = [];

          node.right?.traverseTree((argNode) => {
            if (argNode.type === E_TOKEN_TYPE.FUNCTION_ARGS) {
              if (!argNode.left) {
                error(
                  E_ERROR_CODES.EXECUTOR_ERROR,
                  'Function argument is missing',
                );
                return;
              }

              args.push(this.parseNumberLiteral(argNode.left));
            }
          }, E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER);

          if (operation.length !== args.length) {
            error(
              E_ERROR_CODES.EXECUTOR_ERROR,
              `Invalid function "${functionName}" arguments count. Expected ${operation.length}, got ${args.length}`,
            );
            return;
          }

          const result = operation(...args);

          node.value = JSON.stringify(result);
          node.type = E_TOKEN_TYPE.NUMBER_LITERAL;
          node.left = undefined;
          node.right = undefined;
        }

        if (isSetFunction) {
          const operation =
            Executor.SET_MAP[functionName as E_EXECUTOR_FUNCTION_NAMES];

          if (!operation) {
            error(
              E_ERROR_CODES.EXECUTOR_ERROR,
              `Invalid function "${functionName}" operation`,
            );
            return;
          }

          const sets: Array<Array<number>> = [];

          node.right?.traverseTree((argNode) => {
            if (argNode.type === E_TOKEN_TYPE.FUNCTION_ARGS) {
              if (!argNode.left || argNode.left.type !== E_TOKEN_TYPE.SET) {
                error(
                  E_ERROR_CODES.EXECUTOR_ERROR,
                  'Wrong set argument for set function',
                );
                return;
              }

              const set: Array<number> = [];

              argNode.left.right?.traverseTree((setItem) => {
                if (setItem.type === E_TOKEN_TYPE.SET_ITEM) {
                  if (!setItem.left) {
                    error(
                      E_ERROR_CODES.EXECUTOR_ERROR,
                      'Invalid set item value',
                    );
                    return;
                  }

                  set.push(this.parseNumberLiteral(setItem.left));
                }
              }, E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER);

              sets.push(set);
            }
          }, E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER);

          if (operation.length !== sets.length) {
            error(
              E_ERROR_CODES.EXECUTOR_ERROR,
              `Invalid function "${functionName}" arguments count. Expected ${operation.length}, got ${sets.length}`,
            );
            return;
          }

          const result = operation(...sets);

          if (Array.isArray(result)) {
            node.type = E_TOKEN_TYPE.SET;
            node.value = undefined;
            node.left = undefined;
            if (result.length) {
              node.right = new TAbstractSyntaxTree(
                E_TOKEN_TYPE.SET_ITEM,
                undefined,
                new TAbstractSyntaxTree(
                  E_TOKEN_TYPE.NUMBER_LITERAL,
                  JSON.stringify(result.shift()),
                ),
              );
            } else {
              node.right = undefined;
            }

            while (result.length > 0) {
              node.right = new TAbstractSyntaxTree(
                E_TOKEN_TYPE.SET_ITEM,
                undefined,
                new TAbstractSyntaxTree(
                  E_TOKEN_TYPE.NUMBER_LITERAL,
                  JSON.stringify(result.shift()),
                ),
                node.right,
              );
            }
          } else {
            node.type = E_TOKEN_TYPE.NUMBER_LITERAL;
            node.value = JSON.stringify(result);
            node.left = undefined;
            node.right = undefined;
          }
        }
      }
    }, E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER);

    if (
      this.syntaxTree.right?.type !== E_TOKEN_TYPE.NUMBER_LITERAL &&
      this.syntaxTree.right?.type !== E_TOKEN_TYPE.SET
    ) {
      error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid result');
    }

    if (this.syntaxTree.right) {
      return this.prepareResult();
    }

    return undefined;
  }
}
