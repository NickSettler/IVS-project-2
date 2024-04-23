import { E_TOKEN_TYPE } from './types/common';
import { E_SYNTAX_TREE_TRAVERSE_ORDER } from './types/ast';
import { E_EXECUTOR_FUNCTION_NAMES } from './types/executor';

const condLatexOpenParentheses = (type: E_TOKEN_TYPE | undefined): string =>
  type !== E_TOKEN_TYPE.NUMBER_LITERAL &&
  type !== E_TOKEN_TYPE.NEGATE &&
  type !== E_TOKEN_TYPE.FUNCTION
    ? '('
    : '';

const condLatexCloseParentheses = (type: E_TOKEN_TYPE | undefined): string =>
  type !== E_TOKEN_TYPE.NUMBER_LITERAL &&
  type !== E_TOKEN_TYPE.NEGATE &&
  type !== E_TOKEN_TYPE.FUNCTION
    ? ')'
    : '';

const condSetLatexOpenParentheses = (type: E_TOKEN_TYPE | undefined): string =>
  type && type !== E_TOKEN_TYPE.SET ? '(' : '';

const condSetLatexCloseParentheses = (
  type: E_TOKEN_TYPE | undefined,
): string => (type !== E_TOKEN_TYPE.SET ? ')' : '');

/**
 * Abstract Syntax Tree class
 * @class
 * @classdesc Represents an abstract syntax tree
 */
export class TAbstractSyntaxTree {
  /**
   * Map of token types to their LaTeX representation
   *
   * @private
   * @static
   * @readonly
   * @type {Partial<Record<E_TOKEN_TYPE, string>>}
   */
  private static readonly ML_MAP: Partial<Record<E_TOKEN_TYPE, string>> = {
    [E_TOKEN_TYPE.PLUS]: '+',
    [E_TOKEN_TYPE.MINUS]: '-',
    [E_TOKEN_TYPE.MULTIPLY]: '*',
    [E_TOKEN_TYPE.DIVIDE]: '/',
    [E_TOKEN_TYPE.NEGATE]: '-',
  };

  /**
   * The type of the node
   * @private
   * @type {E_TOKEN_TYPE}
   * @default E_TOKEN_TYPE.NODE
   */
  private _type: E_TOKEN_TYPE = E_TOKEN_TYPE.NODE;

  /**
   * The value of the node
   * @private
   * @type {string | undefined}
   * @default undefined
   */
  private _value?: string;

  /**
   * The left child of the node
   * @private
   * @type {TAbstractSyntaxTree | undefined}
   * @default undefined
   */
  private _left?: TAbstractSyntaxTree;

  /**
   * The right child of the node
   * @private
   * @type {TAbstractSyntaxTree | undefined}
   * @default undefined
   */
  private _right?: TAbstractSyntaxTree;

  /**
   * Empty constructor. Initializes the tree with default values.
   * @constructor
   */
  constructor();

  /**
   * Constructor with type. Initializes the tree with the provided type.
   * @param {E_TOKEN_TYPE} type The type of the node
   * @constructor
   */
  constructor(type: E_TOKEN_TYPE);

  /**
   * Constructor with type and value. Initializes the tree with the provided type and value.
   * @param {E_TOKEN_TYPE} type The type of the node
   * @param {string} value The value of the node
   */
  constructor(type: E_TOKEN_TYPE, value: string);

  /**
   * Constructor with type, value, left and right children. Initializes the tree with the provided type, value, left and right children.
   * @param {E_TOKEN_TYPE} type The type of the node
   * @param {string} value The value of the node
   * @param {TAbstractSyntaxTree} left The left child of the node
   * @param {TAbstractSyntaxTree} right The right child of the node
   */
  constructor(
    type: E_TOKEN_TYPE,
    value: string,
    left: TAbstractSyntaxTree,
    right: TAbstractSyntaxTree,
  );

  /**
   * Constructor with optional parameters. Initializes the tree with the provided parameters.
   * @param {E_TOKEN_TYPE} type The type of the node
   * @param {string} value The value of the node
   * @param {TAbstractSyntaxTree} left The left child of the node
   * @param {TAbstractSyntaxTree} right The right child of the node
   */
  constructor(
    type?: E_TOKEN_TYPE,
    value?: string,
    left?: TAbstractSyntaxTree,
    right?: TAbstractSyntaxTree,
  );

  /**
   * Constructor with optional parameters. Initializes the tree with the provided parameters.
   * @param {E_TOKEN_TYPE} type The type of the node
   * @param {string} value The value of the node
   * @param {TAbstractSyntaxTree} left The left child of the node
   * @param {TAbstractSyntaxTree} right The right child of the node
   */
  constructor(
    type?: E_TOKEN_TYPE,
    value?: string,
    left?: TAbstractSyntaxTree,
    right?: TAbstractSyntaxTree,
  ) {
    if (type) this._type = type;
    if (value) this._value = value;
    if (left) this._left = left;
    if (right) this._right = right;
  }

  /**
   * Traverse the tree in the specified order using the provided function
   * @param {(node: TAbstractSyntaxTree) => void} func The function to be executed on each node
   * @param {E_SYNTAX_TREE_TRAVERSE_ORDER} order The order in which the tree should be traversed
   */
  public traverseTree(
    func: (node: TAbstractSyntaxTree) => void,
    order: E_SYNTAX_TREE_TRAVERSE_ORDER,
  ): void {
    if (order === E_SYNTAX_TREE_TRAVERSE_ORDER.PRE_ORDER) func(this);
    if (this._left) this._left.traverseTree(func, order);
    if (order === E_SYNTAX_TREE_TRAVERSE_ORDER.IN_ORDER) func(this);
    if (this._right) this._right.traverseTree(func, order);
    if (order === E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER) func(this);
  }

  /**
   * Set the type of the node
   * @param {E_TOKEN_TYPE} value The type of the node
   */
  public set type(value: E_TOKEN_TYPE) {
    this._type = value;
  }

  /**
   * Get the type of the node
   * @returns {E_TOKEN_TYPE} The type of the node
   */
  public get type(): E_TOKEN_TYPE {
    return this._type;
  }

  /**
   * Set the value of the node
   * @param {string | undefined} value The value of the node
   */
  public set value(value: string | undefined) {
    this._value = value;
  }

  /**
   * Get the value of the node
   * @returns {string | undefined} The value of the node
   */
  public get value(): string | undefined {
    return this._value;
  }

  /**
   * Set the left child of the node
   * @param {TAbstractSyntaxTree | undefined} value The left child of the node
   */
  public set left(value: TAbstractSyntaxTree | undefined) {
    this._left = value;
  }

  /**
   * Get the left child of the node
   * @returns {TAbstractSyntaxTree | undefined} The left child of the node
   */
  public get left(): TAbstractSyntaxTree | undefined {
    return this._left;
  }

  /**
   * Set the right child of the node
   * @param {TAbstractSyntaxTree | undefined} value The right child of the node
   */
  public set right(value: TAbstractSyntaxTree | undefined) {
    this._right = value;
  }

  /**
   * Get the right child of the node
   * @returns {TAbstractSyntaxTree | undefined} The right child of the node
   */
  public get right(): TAbstractSyntaxTree | undefined {
    return this._right;
  }

  /**
   * Get the LaTeX string representation of the tree
   * @returns {string} The LaTeX string representation of the tree
   */
  public get latexString(): string {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (this._type) {
      case E_TOKEN_TYPE.NUMBER_LITERAL: {
        return this._value ?? '';
      }
      case E_TOKEN_TYPE.PLUS:
      case E_TOKEN_TYPE.MINUS:
        return `${this._left?.latexString ?? ''} ${
          TAbstractSyntaxTree.ML_MAP?.[this._type] ?? ''
        } ${this._right?.latexString ?? ''}`;
      case E_TOKEN_TYPE.NEGATE:
        return `-${this._left?.latexString ?? ''}`;
      case E_TOKEN_TYPE.MULTIPLY:
        return `${condLatexOpenParentheses(
          this._left?.type,
        )}${this._left?.latexString ?? ''}${condLatexCloseParentheses(
          this._left?.type,
        )} * ${condLatexOpenParentheses(
          this._right?.type,
        )}${this._right?.latexString ?? ''}${condLatexCloseParentheses(this._right?.type)}`;
      case E_TOKEN_TYPE.DIVIDE:
        return `\\frac{${this._left?.latexString ?? ''}}{${this._right?.latexString ?? ''}}`;
      case E_TOKEN_TYPE.POWER:
        return `${condLatexOpenParentheses(
          this._left?.type,
        )}${this._left?.latexString ?? ''}${condLatexCloseParentheses(
          this._left?.type,
        )}^{${this._right?.latexString ?? ''}}`;
      case E_TOKEN_TYPE.MODULO:
        return `${condLatexOpenParentheses(
          this._left?.type,
        )}${this._left?.latexString ?? ''}${condLatexCloseParentheses(
          this._left?.type,
        )} \\mod ${condLatexOpenParentheses(
          this._right?.type,
        )}${this._right?.latexString ?? ''}${condLatexCloseParentheses(this._right?.type)}`;
      case E_TOKEN_TYPE.FACTORIAL:
        return `${condLatexOpenParentheses(
          this._left?.type,
        )}${this._left?.latexString ?? ''}${condLatexCloseParentheses(this._left?.type)}!`;
      case E_TOKEN_TYPE.FUNCTION: {
        if (this._left?.type !== E_TOKEN_TYPE.FUNCTION_NAME) return '';

        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (this._left?.value) {
          case E_EXECUTOR_FUNCTION_NAMES.SQRT:
            return `\\sqrt{${this._right?.latexString ?? ''}}`;
          case E_EXECUTOR_FUNCTION_NAMES.SQRTN:
            return `\\sqrt[${this._right?.left?.latexString ?? ''}]{${this._right?._right?.latexString ?? ''}}`;
          case E_EXECUTOR_FUNCTION_NAMES.ABS:
            return `\\left|${this._right?.latexString ?? ''}\\right|`;
          case E_EXECUTOR_FUNCTION_NAMES.UNION:
            return `${condSetLatexOpenParentheses(
              this._right?._left?.type,
            )}${this._right?._left?.latexString ?? ''}${condSetLatexCloseParentheses(
              this._right?._left?.type,
            )}\\cup${condSetLatexOpenParentheses(
              this._right?._right?._left?.type,
            )}${this._right?._right?._left?.latexString ?? ''}${condSetLatexCloseParentheses(
              this._right?._right?._left?.type,
            )}`;
          case E_EXECUTOR_FUNCTION_NAMES.INTERSECT:
            return `${condSetLatexOpenParentheses(
              this._right?._left?.type,
            )}${this._right?._left?.latexString ?? ''}${condSetLatexCloseParentheses(
              this._right?._left?.type,
            )}\\cap${condSetLatexOpenParentheses(
              this._right?._right?._left?.type,
            )}${this._right?._right?._left?.latexString ?? ''}${condSetLatexCloseParentheses(
              this._right?._right?._left?.type,
            )}`;
          case E_EXECUTOR_FUNCTION_NAMES.DIFFERENCE:
          case E_EXECUTOR_FUNCTION_NAMES.DIFF:
            return `${condSetLatexOpenParentheses(
              this._right?._left?.type,
            )}${this._right?._left?.latexString ?? ''}${condSetLatexCloseParentheses(
              this._right?._left?.type,
            )}\\setminus${condSetLatexOpenParentheses(
              this._right?._right?._left?.type,
            )}${this._right?._right?._left?.latexString ?? ''}${condSetLatexCloseParentheses(
              this._right?._right?._left?.type,
            )}`;
          case E_EXECUTOR_FUNCTION_NAMES.MEAN:
            return `mean(\\overline{${this._right?.latexString ?? ''}})`;
          case E_EXECUTOR_FUNCTION_NAMES.MEDIAN:
            return `${this._left?.value}(${this._right?.latexString ?? ''})_{0.5})`;
          case E_EXECUTOR_FUNCTION_NAMES.MODE:
            return `mode(${this._right?.latexString ?? ''})`;
        }

        return `${this._left?.value}(${this._right?.latexString ?? ''})`;
      }
      case E_TOKEN_TYPE.FUNCTION_ARGS: {
        return `${this._right?.latexString ?? ''}${this._right ? ', ' : ''}${this._left?.latexString ?? ''}`;
      }
      case E_TOKEN_TYPE.SET: {
        return `[${this._right?.latexString ?? ''}]`;
      }
      case E_TOKEN_TYPE.SET_ITEM: {
        return `${this._right?.latexString ?? ''}${this._right ? ', ' : ''}${this._left?.latexString ?? ''}`;
      }
      case E_TOKEN_TYPE.NODE:
        return this._right?.latexString ?? '';
    }

    return '';
  }
}
