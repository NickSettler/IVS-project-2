import React, {
  ChangeEvent,
  JSX,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  Stack,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  Executor,
  isExpressionValid,
  Lexer,
  Scanner,
  TAbstractSyntaxTree,
} from '../../lib/calc';
import { cloneDeep, isEmpty, isNull } from 'lodash';
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
import { ArrowForward, ContentCopy, ContentPaste } from '@mui/icons-material';
import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import toast from 'react-hot-toast';

const LatexExpressionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  overflowX: 'auto',
}));

const ExpressionField = styled(TextField)({
  borderRadius: 0,

  '& .MuiInputBase-root': {
    position: 'relative',
    borderRadius: 0,

    '& input': {
      fontFamily: 'monospace',
    },
  },
});

const RunCalcButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  minWidth: 'initial',

  '& .MuiButton-icon': {
    margin: 0,

    '& svg': {
      fontSize: theme.typography.h5.fontSize,
    },
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

  const [isAutoComputeEnabled] = useLocalStorage<boolean>(
    E_LOCAL_STORAGE_KEYS.ENABLE_AUTO_COMPUTE,
    false,
  );

  const [expression, setExpression] = useState<string>('');
  const [expressionTree, setExpressionTree] =
    useState<TAbstractSyntaxTree | null>(null);
  const [latexExpression, setLatexExpression] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [caretStart, setCaretStart] = useState<number>(0);

  const [currentOperationsTab, setCurrentOperationsTab] =
    useState<E_CALCULATOR_OPERATIONS_TABS>(
      E_CALCULATOR_OPERATIONS_TABS.TRIGONOMETRY,
    );

  const updateTree = useCallback(() => {
    try {
      setError('');
      setExpressionTree(null);
      setLatexExpression('');
      const lexer = new Lexer(expression);
      setExpressionTree(
        new Scanner(lexer.getNextToken.bind(lexer)).processQuery(),
      );
    } catch (e: any) {
      setError(e.message);
    }
  }, [expression]);

  const result = useMemo(() => {
    const clonedAST = cloneDeep(expressionTree);

    if (!clonedAST || isEmpty(expression)) return null;

    try {
      const executor = new Executor(clonedAST);
      return executor.execute();
    } catch (e: any) {
      setError(e.message);
    }
  }, [expressionTree, expression]);

  useEffect(() => {
    if (!isAutoComputeEnabled) return;

    updateTree();
  }, [isAutoComputeEnabled, updateTree]);

  useEffect(() => {
    if (!expressionTree) return;

    setLatexExpression(expressionTree.latexString);
  }, [expressionTree]);

  useEffect(() => {
    if (isNull(result)) return;

    console.log(expressionTree);

    setLatexExpression((prev) => `${prev} = ${result}`);
  }, [expressionTree, result]);

  const runCalculation = () => {
    if (isAutoComputeEnabled) return;

    updateTree();
  };

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

  const handleExpressionCopy = async (e: SyntheticEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(expression);
    toast.success('Expression copied to clipboard');
  };

  const handleExpressionPaste = async (e: SyntheticEvent) => {
    e.preventDefault();
    const clipboardExpression = await navigator.clipboard.readText();

    if (isExpressionValid(clipboardExpression)) {
      setCaretStart((prev) => prev + clipboardExpression.length);
      setExpression((prev) => {
        const start = prev.slice(0, caretStart);
        const end = prev.slice(caretStart);
        return `${start}${clipboardExpression}${end}`;
      });
    } else {
      toast.error('Cannot paste invalid expression');
    }
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
        <Typography variant={'caption'}>Result</Typography>
        <MathSVG tex={latexExpression} />
      </LatexExpressionBox>
      <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ mb: 2 }}>
        <ExpressionField
          fullWidth
          autoFocus
          ref={inputRef}
          value={expression}
          label='Expression'
          onInput={handleExpressionChange}
          onKeyUp={handleExpressionFieldCaretChange}
          onClick={handleExpressionFieldCaretChange}
          onSelect={handleExpressionFieldCaretChange}
          onSelectCapture={handleExpressionFieldCaretChange}
          onCopy={handleExpressionCopy}
          onPaste={handleExpressionPaste}
          helperText={error}
          error={!isEmpty(error)}
          InputProps={{
            endAdornment: (
              <Stack direction={'row'} spacing={1}>
                <IconButton
                  onClick={handleExpressionCopy}
                  size={'small'}
                  color={'primary'}
                >
                  <ContentCopy />
                </IconButton>
                <IconButton
                  onClick={handleExpressionPaste}
                  size={'small'}
                  color={'primary'}
                >
                  <ContentPaste />
                </IconButton>
              </Stack>
            ),
          }}
        />
        {!isAutoComputeEnabled && (
          <RunCalcButton
            variant={'contained'}
            endIcon={<ArrowForward />}
            disableElevation
            onClick={runCalculation}
          />
        )}
      </Stack>
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
