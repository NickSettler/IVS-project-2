import { TAbstractSyntaxTree } from './ast';
import { E_SYNTAX_TREE_TRAVERSE_ORDER } from './types/ast';
import { E_TOKEN_TYPE } from './types/common';
import { error } from './error';
import { E_ERROR_CODES } from './types/errors';
import { E_EXECUTOR_FUNCTION_NAMES } from './types/executor.ts';

export class Executor {
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

  private static readonly FUNCTIONS_MAP: Record<
    string,
    (...args: Array<number>) => number
  > = {
    // Number functions
    [E_EXECUTOR_FUNCTION_NAMES.ABS]: Math.abs,
    [E_EXECUTOR_FUNCTION_NAMES.CEIL]: Math.ceil,
    [E_EXECUTOR_FUNCTION_NAMES.FLOOR]: Math.floor,
    [E_EXECUTOR_FUNCTION_NAMES.ROUND]: Math.round,

    // Trigonometric functions
    [E_EXECUTOR_FUNCTION_NAMES.SIN]: Math.sin,
    [E_EXECUTOR_FUNCTION_NAMES.COS]: Math.cos,
    [E_EXECUTOR_FUNCTION_NAMES.TAN]: Math.tan,
    [E_EXECUTOR_FUNCTION_NAMES.COT]: (val) => 1 / Math.tan(val),
    [E_EXECUTOR_FUNCTION_NAMES.CTG]: (val) => 1 / Math.tan(val),
    [E_EXECUTOR_FUNCTION_NAMES.ASIN]: Math.asin,
    [E_EXECUTOR_FUNCTION_NAMES.ACOS]: Math.acos,
    [E_EXECUTOR_FUNCTION_NAMES.ATAN]: Math.atan,
    [E_EXECUTOR_FUNCTION_NAMES.ACOT]: (val) => Math.PI / 2 - Math.atan(val),
    [E_EXECUTOR_FUNCTION_NAMES.ACTG]: (val) => Math.PI / 2 - Math.atan(val),
    [E_EXECUTOR_FUNCTION_NAMES.R2D]: (val) => (val * 180) / Math.PI,
    [E_EXECUTOR_FUNCTION_NAMES.D2R]: (val) => (val * Math.PI) / 180,

    [E_EXECUTOR_FUNCTION_NAMES.SQRT]: Math.sqrt,
    [E_EXECUTOR_FUNCTION_NAMES.SQRTN]: (val, n) => Math.pow(val, 1 / n),
  };

  constructor(private readonly syntaxTree: TAbstractSyntaxTree) {
    //
  }

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

        if (!functionName || !Executor.FUNCTIONS_MAP[functionName]) {
          error(
            E_ERROR_CODES.EXECUTOR_ERROR,
            `Invalid function name "${functionName}"`,
          );
          return;
        }

        const operation = Executor.FUNCTIONS_MAP[functionName];

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
    }, E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER);

    if (this.syntaxTree.right?.type !== E_TOKEN_TYPE.NUMBER_LITERAL) {
      error(E_ERROR_CODES.EXECUTOR_ERROR, 'Invalid result');
    }

    if (this.syntaxTree.right?.value) {
      return JSON.parse(this.syntaxTree.right.value);
    }

    return undefined;
  }
}
