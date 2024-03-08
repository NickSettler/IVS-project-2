export const enum E_TOKEN_TYPE {
  // Common tokens
  NUMBER_LITERAL = 'NUMBER_LITERAL',

  // Arithmetic tokens
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  NEGATE = 'NEGATE',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  MODULO = 'MODULO',
  POWER = 'POWER',
  FACTORIAL = 'FACTORIAL',

  FUNCTION = 'FUNCTION',
  FUNCTION_NAME = 'FUNCTION_NAME',
  FUNCTION_ARGS = 'FUNCTION_ARGS',

  // Lexical tokens
  EOF = 'EOF',
  COMMA = 'COMMA',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',

  // Syntax tokens
  NODE = 'NODE',
}
