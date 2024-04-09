import { JSX } from 'react';
import {
  Box,
  Typography,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { HelpExample } from './HelpExample.tsx';
import { HelpTableRow, THelpTableRowProps } from './HelpTableRow.tsx';
import { entries } from 'lodash';

const HelpBox = styled(Box)(({ theme }) => ({
  height: '50%',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)',
  scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)',
  scrollBehavior: 'smooth',

  [theme.breakpoints.down('md')]: {
    height: '480px',
  },
}));

const HelpAccordion = styled(Accordion)(({ theme }) => ({
  '& ~ .MuiAccordion-root': {
    borderTop: 0,

    '&.Mui-expanded': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },
}));

const HelpAccordions: Record<string, Array<THelpTableRowProps>> = {
  'Arithmetic Operations': [
    {
      operation: 'Addition',
      operator: '+',
      description: 'Sum of left and right operands',
      example: '2 + 3',
      result: '5',
    },
    {
      operation: 'Subtraction',
      operator: '-',
      description: 'Difference of left and right operands',
      example: '5 - 2',
      result: '3',
    },
    {
      operation: 'Multiplication',
      operator: '*',
      description: 'Product of left and right operands',
      example: '3 * 4',
      result: '12',
    },
    {
      operation: 'Division',
      operator: '/',
      description: 'Quotient of left and right operands',
      example: '10 / 2',
      result: '5',
    },
    {
      operation: 'Modulo',
      operator: '%',
      description: 'Remainder of left divided by right',
      example: '7 % 2',
      result: '1',
    },
    {
      operation: 'Power',
      operator: '^',
      description: 'Left raised to the power of right',
      example: '2 ^ 3',
      result: '8',
    },
    {
      operation: 'Factorial',
      operator: '!',
      description: 'Factorial of the number',
      example: '5!',
      result: '120',
    },
  ],
  'Arithmetic Functions': [
    {
      operation: 'Square Root',
      operator: 'sqrt',
      description: 'Square root of the number',
      example: 'sqrt(16)',
      result: '4',
    },
    {
      operation: 'Root of Power',
      operator: 'sqrtn',
      description: 'Root of the number',
      example: 'sqrtn(8, 3)',
      result: '2',
    },
    {
      operation: 'Absolute Value',
      operator: 'abs',
      description: 'Absolute value of the number',
      example: 'abs(-5)',
      result: '5',
    },
    {
      operation: 'Rounding (to min)',
      operator: 'floor',
      description:
        'Rounds the number to the nearest integer less than or equal to the number',
      example: 'floor(4.5)',
      result: '4',
    },
    {
      operation: 'Rounding (to max)',
      operator: 'ceil',
      description:
        'Rounds the number to the nearest integer greater than or equal to the number',
      example: 'ceil(4.5)',
      result: '5',
    },
    {
      operation: 'Rounding (to nearest)',
      operator: 'round',
      description: 'Rounds the number to the nearest integer',
      example: 'round(4.5)',
      result: '5',
    },
  ],
  'Trigonometric Functions': [
    {
      operation: 'Degrees to Radians',
      operator: 'D2R',
      description: 'Converts degrees to radians',
      example: 'D2R(180)',
      result: '3.141592653589793',
    },
    {
      operation: 'Radians to Degrees',
      operator: 'R2D',
      description: 'Converts radians to degrees',
      example: 'R2D(3.141592653589793)',
      result: '180',
    },
    {
      operation: 'Sine',
      operator: 'sin',
      description: 'Sine of the angle',
      example: 'sin(0)',
      result: '0',
    },
    {
      operation: 'Cosine',
      operator: 'cos',
      description: 'Cosine of the angle',
      example: 'cos(0)',
      result: '1',
    },
    {
      operation: 'Tangent',
      operator: 'tan',
      description: 'Tangent of the angle',
      example: 'tan(0)',
      result: '0',
    },
    {
      operation: 'Cotangent',
      operator: 'cot',
      description: 'Cotangent of the angle',
      example: 'cot(0)',
      result: 'Infinity',
    },
    {
      operation: 'Arcsine',
      operator: 'asin',
      description: 'Arcsine of the angle',
      example: 'asin(0)',
      result: '0',
    },
    {
      operation: 'Arccosine',
      operator: 'acos',
      description: 'Arccosine of the angle',
      example: 'acos(1)',
      result: '0',
    },
    {
      operation: 'Arctangent',
      operator: 'atan',
      description: 'Arctangent of the angle',
      example: 'atan(0)',
      result: '0',
    },
    {
      operation: 'Arccotangent',
      operator: 'acot',
      description: 'Arccotangent of the angle',
      example: 'acot(0)',
      result: 'Infinity',
    },
  ],
  'Set Functions': [
    {
      operation: 'Union',
      operator: 'union',
      description: 'Union of two sets',
      example: 'union([1, 2], [2, 3])',
      result: '[1, 2, 3]',
    },
    {
      operation: 'Intersection',
      operator: 'intersect',
      description: 'Intersection of two sets',
      example: 'intersect([1, 2], [2, 3])',
      result: '[2]',
    },
    {
      operation: 'Difference',
      operator: 'diff',
      description: 'Difference of two sets',
      example: 'diff([1, 2], [2, 3])',
      result: '[1]',
    },
  ],
  'Statistics Functions': [
    {
      operation: 'Sum',
      operator: 'sum',
      description: 'Sum of the numbers',
      example: 'sum([1, 2, 3])',
      result: '6',
    },
    {
      operation: 'Minimum',
      operator: 'min',
      description: 'Minimum of the numbers',
      example: 'min([1, 2, 3])',
      result: '1',
    },
    {
      operation: 'Maximum',
      operator: 'max',
      description: 'Maximum of the numbers',
      example: 'max([1, 2, 3])',
      result: '3',
    },
    {
      operation: 'Count',
      operator: 'count',
      description: 'Count of the numbers',
      example: 'count([1, 2, 3])',
      result: '3',
    },
    {
      operation: 'Mean',
      operator: 'mean',
      description: 'Mean of the numbers',
      example: 'mean([1, 2, 3])',
      result: '2',
    },
    {
      operation: 'Median',
      operator: 'median',
      description: 'Median of the numbers',
      example: 'median([1, 2, 3])',
      result: '2',
    },
    {
      operation: 'Mode',
      operator: 'mode',
      description: 'Mode of the numbers',
      example: 'mode([1, 2, 2, 3])',
      result: '2',
    },
    {
      operation: 'Range',
      operator: 'range',
      description: 'Range of the numbers',
      example: 'range([1, 2, 3])',
      result: '2',
    },
    {
      operation: 'Variance',
      operator: 'var',
      description: 'Variance of the numbers',
      example: 'var([1, 2, 3])',
      result: '0.6666666666666666',
    },
    {
      operation: 'Standard Deviation',
      operator: 'stddev',
      description: 'Standard deviation of the numbers',
      example: 'stddev([1, 2, 3])',
      result: '1',
    },
    {
      operation: 'Mean Absolute Deviation',
      operator: 'MAD',
      description: 'Mean absolute deviation of the numbers',
      example: 'MAD([1, 2, 3])',
      result: '0.6666666666666666',
    },
    {
      operation: 'Root Mean Square',
      operator: 'RMS',
      description: 'Root mean square of the numbers',
      example: 'RMS([1, 2, 3])',
      result: '2.160246899469287',
    },
  ],
  'Random Functions': [
    {
      operation: 'Random Number',
      operator: 'rand',
      description: 'Random number between 0 and 1',
      example: 'rand()',
      result: '0.123456789',
    },
    {
      operation: 'Random Integer',
      operator: 'randint',
      description: 'Random integer between min and max',
      example: 'randint(1, 10)',
      result: '5',
    },
    {
      operation: 'Random Number (Normal distribution)',
      operator: 'randn',
      description: 'Random number with normal distribution by mean and stddev',
      example: 'randn(0, 1)',
      result: '0.123456789',
    },
  ],
};

export const Help = (): JSX.Element => {
  return (
    <HelpBox>
      <HelpAccordion variant={'outlined'}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Basic Usage</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body1'>
            This calculator supports arithmetic operations, trigonometric
            functions, sets functions, statistics functions, random functions,
            and other mathematical functions.
            <br />
            <br />
            To input your expression, you can use the buttons on the calculator
            or type it in the input field. Some functions are not available on
            the calculator buttons, but you can still use them by typing them in
            the input field. This help box will provide you with a list of all
            the available functions and how to use them.
            <br />
            <br />
            To solve an expression, simply type it in the input field and the
            answer will appear in the result field. You do not need to press any
            special key to compute the result. This is enabled by the
            <em> auto compute </em> feature. This feature can be disabled by
            unchecking the <em> Enable auto compute </em> checkbox in the
            settings (gear in the top right corner). When disabling it, you will
            need to press the button next to the input field to compute the
            result.
            <br />
            <br />
            You can copy and paste expressions into the input field. You can
            simply select the expression you want to copy and press
            <code>Ctrl + C</code> or use the copy button on the right of the
            input field. To paste an expression, you can press{' '}
            <code>Ctrl + V</code> or use the paste button on the right of the
            input.
          </Typography>
        </AccordionDetails>
      </HelpAccordion>
      {entries(HelpAccordions).map(([title, table]) => (
        <HelpAccordion variant={'outlined'} key={title}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} variant={'outlined'}>
              <Table size={'small'}>
                <TableHead>
                  <TableRow>
                    <TableCell>Operation</TableCell>
                    <TableCell>Operator</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Example</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.map((props) => (
                    <HelpTableRow {...props} key={props.operator} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant='h6'>Examples</Typography>
            <Box>
              {table.map((props) => (
                <HelpExample {...props} key={props.operator} />
              ))}
            </Box>
          </AccordionDetails>
        </HelpAccordion>
      ))}
    </HelpBox>
  );
};
