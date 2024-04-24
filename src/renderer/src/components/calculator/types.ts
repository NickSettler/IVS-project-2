import { ButtonProps } from '@mui/material';

/**
 * Calculator buttons
 * @enum
 */
export enum E_CALCULATOR_BUTTONS {
  /**
   * Number 1 button
   */
  NUMBER_1 = '1',
  /**
   * Number 2 button
   */
  NUMBER_2 = '2',
  /**
   * Number 3 button
   */
  NUMBER_3 = '3',
  /**
   * Number 4 button
   */
  NUMBER_4 = '4',
  /**
   * Number 5 button
   */
  NUMBER_5 = '5',
  /**
   * Number 6 button
   */
  NUMBER_6 = '6',
  /**
   * Number 7 button
   */
  NUMBER_7 = '7',
  /**
   * Number 8 button
   */
  NUMBER_8 = '8',
  /**
   * Number 9 button
   */
  NUMBER_9 = '9',
  /**
   * Number 0 button
   */
  NUMBER_0 = '0',

  /**
   * Decimal point button
   */
  DECIMAL = '.',

  /**
   * Power of ten button
   */
  POWER_OF_TEN = '*10^{n}',

  /**
   * Addition operation button
   */
  ADD = '+',
  /**
   * Subtraction operation button
   */
  SUBTRACT = '-',
  /**
   * Multiplication operation button
   */
  MULTIPLY = '*',
  /**
   * Division operation button
   */
  DIVIDE = '/',

  /**
   * Open parenthesis button
   */
  OPEN_PAREN = '(',
  /**
   * Close parenthesis button
   */
  CLOSE_PAREN = ')',

  /**
   * Delete character button
   */
  DELETE = 'DEL',
  /**
   * Clear input button
   */
  CLEAR = 'AC',

  /**
   * Convert radians to degrees function button
   */
  R2D = 'R2D()',
  /**
   * Convert degrees to radians function button
   */
  D2R = 'D2R()',
  /**
   * Sine function button
   */
  SIN = 'sin()',
  /**
   * Cosine function button
   */
  COS = 'cos()',
  /**
   * Tangent function button
   */
  TAN = 'tan()',
  /**
   * Cotangent function button
   */
  CTG = 'ctg()',
  /**
   * Arcsine function button
   */
  ASIN = 'asin()',
  /**
   * Arccosine function button
   */
  ACOS = 'acos()',
  /**
   * Arctangent function button
   */
  ATAN = 'atan()',
  /**
   * Arccotangent function button
   */
  ACTG = 'actg()',

  /**
   * Empty set button
   */
  EMPTY_SET = '\\emptyset',
  /**
   * Comma button
   */
  COMMA = ',',

  /**
   * Union set operation button
   */
  UNION = 'union()',
  /**
   * Intersection set operation button
   */
  INTERSECT = 'intersect()',
  /**
   * Difference set operation button
   */
  DIFFERENCE = 'difference()',

  /**
   * Set sum function button
   */
  SUM = 'sum()',
  /**
   * Set minimum function button
   */
  MIN = 'min()',
  /**
   * Set maximum function button
   */
  MAX = 'max()',
  /**
   * Set count function button
   */
  COUNT = 'count()',
  /**
   * Set mean function button
   */
  MEAN = 'mean()',
  /**
   * Set median function button
   */
  MEDIAN = 'median()',
  /**
   * Set mode function button
   */
  MODE = 'mode()',
  /**
   * Set range function button
   */
  RANGE = 'range()',
  /**
   * Set variance function button
   */
  VAR = 'var()',
  /**
   * Set standard deviation function button
   */
  STDDEV = 'stddev()',
  /**
   * Set mean absolute deviation function button
   */
  MAD = 'MAD()',
  /**
   * Set root-mean-square function button
   */
  RMS = 'RMS()',

  /**
   * Random number function button
   */
  RAND = 'rand()',
  /**
   * Random integer function button
   */
  RANDINT = 'randint()',
  /**
   * Random normal distribution function button
   */
  RANDN = 'randn()',
}

/**
 * Calculator button mode
 */
export enum E_CALCULATOR_BUTTON_MODE {
  /**
   * Append mode. This mode appends the button value to the input string.
   */
  APPEND = 'APPEND',
  /**
   * Action mode. This mode performs an action on the input string.
   */
  ACTION = 'ACTION',
}

const bracketFunctionAction = (
  action: string,
  input: string,
  caretPosition: number,
): [string, number] => {
  const newCaretPosition = caretPosition + action.length - 1;
  return [
    input.slice(0, caretPosition) + action + input.slice(caretPosition),
    newCaretPosition,
  ];
};

/**
 * Calculator button actions. These actions are performed on the input string when a button is clicked.
 */
export const CalculatorButtonActions: Partial<
  Record<
    E_CALCULATOR_BUTTONS,
    (input: string, caretPosition: number) => [string, number]
  >
> = {
  [E_CALCULATOR_BUTTONS.CLEAR]: () => ['', 0],
  [E_CALCULATOR_BUTTONS.DELETE]: (input, caretPosition) => {
    const newCaretPosition = caretPosition - 1;
    return [
      input.slice(0, newCaretPosition) + input.slice(caretPosition),
      newCaretPosition,
    ];
  },
  [E_CALCULATOR_BUTTONS.POWER_OF_TEN]: (input, caretPosition) => {
    const newCaretPosition = caretPosition + 4;
    return [
      input.slice(0, caretPosition) + '*10^' + input.slice(caretPosition),
      newCaretPosition,
    ];
  },
  [E_CALCULATOR_BUTTONS.EMPTY_SET]: (input, caretPosition) => {
    const newCaretPosition = caretPosition + 1;
    return [
      input.slice(0, caretPosition) + '[]' + input.slice(caretPosition),
      newCaretPosition,
    ];
  },
  ...Object.fromEntries(
    [
      E_CALCULATOR_BUTTONS.R2D,
      E_CALCULATOR_BUTTONS.D2R,
      E_CALCULATOR_BUTTONS.SIN,
      E_CALCULATOR_BUTTONS.COS,
      E_CALCULATOR_BUTTONS.TAN,
      E_CALCULATOR_BUTTONS.CTG,
      E_CALCULATOR_BUTTONS.ASIN,
      E_CALCULATOR_BUTTONS.ACOS,
      E_CALCULATOR_BUTTONS.ATAN,
      E_CALCULATOR_BUTTONS.ACTG,
      E_CALCULATOR_BUTTONS.UNION,
      E_CALCULATOR_BUTTONS.INTERSECT,
      E_CALCULATOR_BUTTONS.DIFFERENCE,
      E_CALCULATOR_BUTTONS.SUM,
      E_CALCULATOR_BUTTONS.MIN,
      E_CALCULATOR_BUTTONS.MAX,
      E_CALCULATOR_BUTTONS.COUNT,
      E_CALCULATOR_BUTTONS.MEAN,
      E_CALCULATOR_BUTTONS.MEDIAN,
      E_CALCULATOR_BUTTONS.MODE,
      E_CALCULATOR_BUTTONS.RANGE,
      E_CALCULATOR_BUTTONS.VAR,
      E_CALCULATOR_BUTTONS.STDDEV,
      E_CALCULATOR_BUTTONS.MAD,
      E_CALCULATOR_BUTTONS.RMS,
      E_CALCULATOR_BUTTONS.RAND,
      E_CALCULATOR_BUTTONS.RANDINT,
      E_CALCULATOR_BUTTONS.RANDN,
    ].map((action) => [
      action,
      (input: string, caretPosition: number): [string, number] =>
        bracketFunctionAction(action, input, caretPosition),
    ]),
  ),
};

/**
 * Calculator button type
 */
export type TCalculatorButton = {
  /**
   * Button value {@link E_CALCULATOR_BUTTONS}
   */
  value: E_CALCULATOR_BUTTONS;
  /**
   * Button mode {@link E_CALCULATOR_BUTTON_MODE}
   */
  mode?: E_CALCULATOR_BUTTON_MODE;
  /**
   * Button color {@link ButtonProps}
   */
  color?: ButtonProps['color'];
};

/**
 * Calculator basic buttons
 */
export const CalculatorBasicButtons: Array<TCalculatorButton> = [
  { value: E_CALCULATOR_BUTTONS.NUMBER_7 },
  { value: E_CALCULATOR_BUTTONS.NUMBER_8 },
  { value: E_CALCULATOR_BUTTONS.NUMBER_9 },
  {
    value: E_CALCULATOR_BUTTONS.DELETE,
    mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    color: 'secondary',
  },
  {
    value: E_CALCULATOR_BUTTONS.CLEAR,
    mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    color: 'secondary',
  },
  { value: E_CALCULATOR_BUTTONS.NUMBER_4 },
  { value: E_CALCULATOR_BUTTONS.NUMBER_5 },
  { value: E_CALCULATOR_BUTTONS.NUMBER_6 },
  { value: E_CALCULATOR_BUTTONS.MULTIPLY },
  { value: E_CALCULATOR_BUTTONS.DIVIDE },
  { value: E_CALCULATOR_BUTTONS.NUMBER_1 },
  { value: E_CALCULATOR_BUTTONS.NUMBER_2 },
  { value: E_CALCULATOR_BUTTONS.NUMBER_3 },
  { value: E_CALCULATOR_BUTTONS.ADD },
  { value: E_CALCULATOR_BUTTONS.SUBTRACT },
  { value: E_CALCULATOR_BUTTONS.NUMBER_0 },
  { value: E_CALCULATOR_BUTTONS.DECIMAL },
  {
    value: E_CALCULATOR_BUTTONS.POWER_OF_TEN,
    mode: E_CALCULATOR_BUTTON_MODE.ACTION,
  },
  { value: E_CALCULATOR_BUTTONS.OPEN_PAREN },
  { value: E_CALCULATOR_BUTTONS.CLOSE_PAREN },
];

/**
 * Calculator trigonometric buttons
 */
export const CalculatorTrigonometricButtons: Array<Array<TCalculatorButton>> = [
  [
    {
      value: E_CALCULATOR_BUTTONS.R2D,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.D2R,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
  ],
  [
    {
      value: E_CALCULATOR_BUTTONS.SIN,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.COS,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.TAN,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.CTG,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
  ],
  [
    {
      value: E_CALCULATOR_BUTTONS.ASIN,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.ACOS,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.ATAN,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.ACTG,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
  ],
];

/**
 * Calculator set buttons
 */
export const CalculatorSetButtons: Array<Array<TCalculatorButton>> = [
  [
    {
      value: E_CALCULATOR_BUTTONS.EMPTY_SET,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.COMMA,
    },
  ],
  [
    {
      value: E_CALCULATOR_BUTTONS.UNION,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.INTERSECT,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.DIFFERENCE,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
  ],
];

/**
 * Calculator statistical buttons
 */
export const CalculatorStatisticalButtons: Array<Array<TCalculatorButton>> = [
  [
    {
      value: E_CALCULATOR_BUTTONS.SUM,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.MIN,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.MAX,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.COUNT,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
  ],
  [
    {
      value: E_CALCULATOR_BUTTONS.MEAN,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.MEDIAN,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.MODE,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.RANGE,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
  ],
  [
    {
      value: E_CALCULATOR_BUTTONS.VAR,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.STDDEV,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.MAD,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.RMS,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
  ],
];

/**
 * Calculator random buttons
 */
export const CalculatorRandomButtons: Array<Array<TCalculatorButton>> = [
  [
    {
      value: E_CALCULATOR_BUTTONS.RAND,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.RANDINT,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
    {
      value: E_CALCULATOR_BUTTONS.RANDN,
      mode: E_CALCULATOR_BUTTON_MODE.ACTION,
    },
  ],
];
