import React, { JSX, MouseEvent } from 'react';
import { Button, styled } from '@mui/material';
import { MathSVG } from '../math/Math.tsx';
import { E_CALCULATOR_BUTTON_MODE, E_CALCULATOR_BUTTONS } from './types.ts';

export type TCalculatorButtonProps = {
  value: E_CALCULATOR_BUTTONS;
  mode?: E_CALCULATOR_BUTTON_MODE;
  size?: 'medium' | 'small';
  onClick(value: E_CALCULATOR_BUTTONS, mode: E_CALCULATOR_BUTTON_MODE): void;
};

const CalculatorButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{
  size?: 'medium' | 'small';
}>(({ theme, size = 'medium' }) => ({
  borderRadius: 0,
  fontSize:
    size === 'medium'
      ? theme.typography.h4.fontSize
      : theme.typography.h6.fontSize,
}));

export const CalculatorButton = ({
  value,
  onClick,
  mode = E_CALCULATOR_BUTTON_MODE.APPEND,
  size = 'medium',
}: TCalculatorButtonProps): JSX.Element => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
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
    >
      <MathSVG tex={value} />
      {/* {value}*/}
    </CalculatorButtonStyled>
  );
};
