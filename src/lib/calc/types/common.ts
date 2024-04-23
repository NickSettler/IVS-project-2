/**
 * Enum for lexer and parser token types. It is used to distinguish between different token types.
 * @enum
 */
export const enum E_TOKEN_TYPE {
  /**
   * Number literal token type. Represents a number literal (e.g. 1, 2, 3, 4, 5, 6, 7, 8, 9, 0).
   */
  NUMBER_LITERAL = 'NUMBER_LITERAL',

  /**
   * Plus sign token type. Represents a plus sign (+) or addition operation.
   */
  PLUS = 'PLUS',
  /**
   * Minus sign token type. Represents a minus sign (-) or subtraction operation.
   */
  MINUS = 'MINUS',
  /**
   * Negate sign token type. Represents a negate sign (-) or negation unary operation.
   */
  NEGATE = 'NEGATE',
  /**
   * Multiply sign token type. Represents a multiply sign (*) or multiplication operation.
   */
  MULTIPLY = 'MULTIPLY',
  /**
   * Divide sign token type. Represents a divide sign (/) or division operation.
   */
  DIVIDE = 'DIVIDE',
  /**
   * Modulo sign token type. Represents a modulo sign (%) or modulo operation.
   */
  MODULO = 'MODULO',
  /**
   * Power sign token type. Represents a power sign (^, **) or power operation.
   */
  POWER = 'POWER',
  /**
   * Factorial sign token type. Represents a factorial sign (!) or factorial operation.
   */
  FACTORIAL = 'FACTORIAL',

  /**
   * Function token type. Represents a function call in a tree.
   */
  FUNCTION = 'FUNCTION',
  /**
   * Function name token type. Represents a function name (e.g. sin, cos, tan, sqrt, etc.).
   */
  FUNCTION_NAME = 'FUNCTION_NAME',
  /**
   * Function arguments token type. Represents a function arguments as number literals.
   */
  FUNCTION_ARGS = 'FUNCTION_ARGS',

  /**
   * Set token type. Represents a set of numbers (e.g. [1, 2, 3, 4, 5]).
   */
  SET = 'SET',
  /**
   * Set item token type. Represents a set item (e.g. 1, 2, 3, 4, 5).
   */
  SET_ITEM = 'SET_ITEM',

  /**
   * End of file token type. Represents the end of file.
   */
  EOF = 'EOF',
  /**
   * Comma token type. Represents a comma (,) token.
   */
  COMMA = 'COMMA',
  /**
   * Open parenthesis token type. Represents an open parenthesis ( `(` ) token.
   */
  OPEN_PAREN = 'OPEN_PAREN',
  /**
   * Close parenthesis token type. Represents a close parenthesis ( `)` ) token.
   */
  CLOSE_PAREN = 'CLOSE_PAREN',
  /**
   * Square open parenthesis token type. Represents a square open parenthesis ( `[` ) token.
   */
  SQUARE_OPEN_PAREN = 'SQUARE_OPEN_PAREN',
  /**
   * Square close parenthesis token type. Represents a square close parenthesis ( `]` ) token.
   */
  SQUARE_CLOSE_PAREN = 'SQUARE_CLOSE_PAREN',

  /**
   * Node token type. Represents a node in a tree.
   */
  NODE = 'NODE',
}
