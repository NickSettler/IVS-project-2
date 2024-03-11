import { ButtonProps } from '@mui/material';

export enum E_CALCULATOR_BUTTONS {
  NUMBER_1 = '1',
  NUMBER_2 = '2',
  NUMBER_3 = '3',
  NUMBER_4 = '4',
  NUMBER_5 = '5',
  NUMBER_6 = '6',
  NUMBER_7 = '7',
  NUMBER_8 = '8',
  NUMBER_9 = '9',
  NUMBER_0 = '0',

  DECIMAL = '.',

  POWER_OF_TEN = '*10^{n}',

  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/',

  OPEN_PAREN = '(',
  CLOSE_PAREN = ')',

  DELETE = 'DEL',
  CLEAR = 'AC',

  R2D = 'R2D()',
  D2R = 'D2R()',
  SIN = 'sin()',
  COS = 'cos()',
  TAN = 'tan()',
  CTG = 'ctg()',
  ASIN = 'asin()',
  ACOS = 'acos()',
  ATAN = 'atan()',
  ACTG = 'actg()',

  EMPTY_SET = '\\emptyset',
  COMMA = ',',

  UNION = 'union()',
  INTERSECT = 'intersect()',
  DIFFERENCE = 'difference()',

  SUM = 'sum()',
  MIN = 'min()',
  MAX = 'max()',
  COUNT = 'count()',
  MEAN = 'mean()',
  MEDIAN = 'median()',
  MODE = 'mode()',
  RANGE = 'range()',
  VAR = 'var()',
  STDDEV = 'stddev()',
  MAD = 'MAD()',
  RMS = 'RMS()',

  RAND = 'rand()',
  RANDINT = 'randint()',
  RANDN = 'randn()',
}

export enum E_CALCULATOR_BUTTON_MODE {
  APPEND = 'APPEND',
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
      (input: string, caretPosition: number) =>
        bracketFunctionAction(action, input, caretPosition),
    ]),
  ),
};

export type TCalculatorButton = {
  value: E_CALCULATOR_BUTTONS;
  mode?: E_CALCULATOR_BUTTON_MODE;
  color?: ButtonProps['color'];
};

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
