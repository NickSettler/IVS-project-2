import { JSX, MouseEvent } from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import { MathSVG } from '../math/Math.tsx';
import { E_CALCULATOR_BUTTON_MODE, E_CALCULATOR_BUTTONS } from './types.ts';

/**
 * Calculator button props
 */
export type TCalculatorButtonProps = {
  /**
   * Button value {@link E_CALCULATOR_BUTTONS}
   */
  value: E_CALCULATOR_BUTTONS;
  /**
   * Button mode {@link E_CALCULATOR_BUTTON_MODE}
   */
  mode?: E_CALCULATOR_BUTTON_MODE;
  /**
   * Button size
   */
  size?: 'medium' | 'small';
  /**
   * Button color {@link ButtonProps}
   */
  color?: ButtonProps['color'];
  /**
   * Is square button
   */
  isSquare?: boolean;
  /**
   * On click button handler
   * @param {E_CALCULATOR_BUTTONS} value Button value
   * @param {E_CALCULATOR_BUTTON_MODE} mode Button mode
   */
  onClick(value: E_CALCULATOR_BUTTONS, mode: E_CALCULATOR_BUTTON_MODE): void;
};

const CalculatorButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'isSquare',
})<{
  isSquare?: boolean;
  size?: 'medium' | 'small';
}>(({ theme, size = 'medium', isSquare = false }) => ({
  borderRadius: 0,
  fontSize:
    size === 'medium'
      ? theme.typography.h5.fontSize
      : theme.typography.h6.fontSize,

  ...(isSquare && {
    width: '100%',
    maxWidth: 164,
    aspectRatio: '1/1',
  }),

  [theme.breakpoints.down('md')]: {
    fontSize:
      size === 'medium'
        ? theme.typography.h5.fontSize
        : theme.typography.body1.fontSize,
  },
}));

/**
 * Calculator button component. Renders a button with a math symbol.
 *
 * @param {TCalculatorButtonProps} props Button props
 * @constructor
 */
export const CalculatorButton = ({
  value,
  onClick,
  mode = E_CALCULATOR_BUTTON_MODE.APPEND,
  color = 'primary',
  size = 'medium',
  isSquare = false,
}: TCalculatorButtonProps): JSX.Element => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    e.preventDefault();

    onClick(value, mode);
  };

  return (
    <CalculatorButtonStyled
      variant={'contained'}
      disableElevation
      onClick={handleClick}
      size={size}
      color={color}
      isSquare={isSquare}
    >
      <MathSVG tex={value} />
    </CalculatorButtonStyled>
  );
};
