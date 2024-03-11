import React, {
  ChangeEvent,
  JSX,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  ButtonProps,
  Stack,
  styled,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { Executor, Lexer, Scanner } from '../../lib/calc';
import { cloneDeep, isEmpty } from 'lodash';
import { MathSVG } from '../math/Math.tsx';
import { CalculatorButton } from './CalculatorButton.tsx';
import {
  CalculatorBasicButtons,
  CalculatorButtonActions,
  CalculatorRandomButtons,
  CalculatorSetButtons,
  CalculatorStatisticalButtons,
  CalculatorTrigonometricButtons,
  E_CALCULATOR_BUTTON_MODE,
  E_CALCULATOR_BUTTONS,
  TCalculatorButton,
} from './types.ts';

const LatexExpressionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  overflowX: 'auto',
}));

const ExpressionField = styled(TextField)(({ theme }) => ({
  borderRadius: 0,
  marginBottom: theme.spacing(2),

  '& .MuiInputBase-root': {
    borderRadius: 0,
  },
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: 'repeat(5, 1fr)',
}));

const OperationsTabs = styled(Tabs)({
  '& .MuiTab-root': {
    flexGrow: 1,
  },
});

const OperationsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  overflow: 'hidden',
  flexGrow: 1,

  '& > *': {
    display: 'flex',
    gap: theme.spacing(1),

    '& > button': {
      flexGrow: 1,
      flexBasis: 0,
    },
  },
}));

export enum E_CALCULATOR_OPERATIONS_TABS {
  TRIGONOMETRY = 0,
  SETS = 1,
  STATISTICS = 2,
  RANDOM = 3,
}

type TTabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const CustomTabPanel = (props: TTabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && <OperationsContainer>{children}</OperationsContainer>}
    </div>
  );
};

export const Calculator = (): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [expression, setExpression] = useState<string>('');
  const [latexExpression, setLatexExpression] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [caretStart, setCaretStart] = useState<number>(0);

  const [currentOperationsTab, setCurrentOperationsTab] =
    useState<E_CALCULATOR_OPERATIONS_TABS>(
      E_CALCULATOR_OPERATIONS_TABS.TRIGONOMETRY,
    );

  const AST = useMemo(() => {
    try {
      setError('');
      setLatexExpression('');
      const lexer = new Lexer(expression);
      return new Scanner(lexer.getNextToken.bind(lexer)).processQuery();
    } catch (e: any) {
      setError(e.message);
    }
  }, [expression]);

  const result = useMemo(() => {
    const clonedAST = cloneDeep(AST);

    if (!clonedAST || isEmpty(expression)) return null;

    try {
      const executor = new Executor(clonedAST);
      return executor.execute();
    } catch (e: any) {
      setError(e.message);
    }
  }, [AST, expression]);

  useEffect(() => {
    if (!AST) return;

    setLatexExpression(AST.latexString);
  }, [AST]);

  useEffect(() => {
    if (!result) return;

    setLatexExpression((prev) => `${prev} = ${result}`);
  }, [expression, result]);

  const handleExpressionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value);
  };

  const handleExpressionFieldCaretChange = (e: any) => {
    setCaretStart((e.target as HTMLInputElement).selectionStart ?? 0);
  };

  const handleCalcButtonAction = (action: E_CALCULATOR_BUTTONS) => {
    const func = CalculatorButtonActions[action];

    if (!func) return;

    const [newExpression, newCaretStart] = func(expression, caretStart);

    setExpression(newExpression);
    setCaretStart(newCaretStart);

    setTimeout(() => {
      const input = inputRef.current?.querySelector('input');

      if (input) {
        input.focus();
        input.setSelectionRange(newCaretStart, newCaretStart);
      }
    }, 0);
  };

  const handleCalcButtonClick = (
    value: E_CALCULATOR_BUTTONS,
    mode: E_CALCULATOR_BUTTON_MODE,
  ) => {
    if (mode === E_CALCULATOR_BUTTON_MODE.ACTION) {
      handleCalcButtonAction(value);
      return;
    }

    setTimeout(() => {
      const input = inputRef.current?.querySelector('input');

      if (input) {
        input.focus();
        input.setSelectionRange(
          caretStart + value.length,
          caretStart + value.length,
        );
      }
    }, 0);

    setExpression((prev) => {
      const start = prev.slice(0, caretStart);
      const end = prev.slice(caretStart);
      return `${start}${value}${end}`;
    });
    setCaretStart((prev) => prev + value.length);
  };

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setCurrentOperationsTab(newValue as E_CALCULATOR_OPERATIONS_TABS);
  };

  const BasicCalculatorButton =
    (size?: Exclude<ButtonProps['size'], 'large'>, isSquare = false) =>
    // eslint-disable-next-line react/display-name
    ({ value, mode, color }: TCalculatorButton) => (
      <CalculatorButton
        key={value}
        value={value}
        isSquare={isSquare}
        {...(mode && { mode })}
        {...(color && { color })}
        {...(size && { size })}
        onClick={handleCalcButtonClick}
      />
    );

  return (
    <Stack>
      <LatexExpressionBox>
        <MathSVG tex={latexExpression} />
      </LatexExpressionBox>
      <ExpressionField
        ref={inputRef}
        value={expression}
        label='Expression'
        onInput={handleExpressionChange}
        onKeyUp={handleExpressionFieldCaretChange}
        onClick={handleExpressionFieldCaretChange}
        helperText={error}
        error={!isEmpty(error)}
        autoFocus
      />
      <ButtonsContainer>
        {CalculatorBasicButtons.map(BasicCalculatorButton('medium', true))}
      </ButtonsContainer>
      <Box>
        <OperationsTabs
          value={currentOperationsTab}
          variant={'scrollable'}
          scrollButtons={false}
          onChange={handleTabChange}
        >
          <Tab
            label='Trigonometry'
            value={E_CALCULATOR_OPERATIONS_TABS.TRIGONOMETRY}
          />
          <Tab label='Sets' value={E_CALCULATOR_OPERATIONS_TABS.SETS} />
          <Tab
            label='Statistics'
            value={E_CALCULATOR_OPERATIONS_TABS.STATISTICS}
          />
          <Tab label='Random' value={E_CALCULATOR_OPERATIONS_TABS.RANDOM} />
        </OperationsTabs>
        <CustomTabPanel
          value={currentOperationsTab}
          index={E_CALCULATOR_OPERATIONS_TABS.TRIGONOMETRY}
        >
          {CalculatorTrigonometricButtons.map((row, index) => (
            <Box key={index}>{row.map(BasicCalculatorButton('small'))}</Box>
          ))}
        </CustomTabPanel>
        <CustomTabPanel
          value={currentOperationsTab}
          index={E_CALCULATOR_OPERATIONS_TABS.SETS}
        >
          {CalculatorSetButtons.map((row, index) => (
            <Box key={index}>{row.map(BasicCalculatorButton('small'))}</Box>
          ))}
        </CustomTabPanel>
        <CustomTabPanel
          value={currentOperationsTab}
          index={E_CALCULATOR_OPERATIONS_TABS.STATISTICS}
        >
          {CalculatorStatisticalButtons.map((row, index) => (
            <Box key={index}>{row.map(BasicCalculatorButton('small'))}</Box>
          ))}
        </CustomTabPanel>
        <CustomTabPanel
          value={currentOperationsTab}
          index={E_CALCULATOR_OPERATIONS_TABS.RANDOM}
        >
          {CalculatorRandomButtons.map((row, index) => (
            <Box key={index}>{row.map(BasicCalculatorButton('small'))}</Box>
          ))}
        </CustomTabPanel>
      </Box>
    </Stack>
  );
};
