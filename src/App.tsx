import { JSX } from 'react';
import { Box, CssBaseline, styled } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Calculator } from './components/calculator/Calculator.tsx';
import { Info } from './components/info/Info.tsx';

const MainWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',

  [theme.breakpoints.down('md')]: {
    height: 'auto',
    padding: theme.spacing(1),
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  gap: theme.spacing(2),

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },

  '& > *': {
    '&:last-child': {
      flexGrow: 1,
    },

    [theme.breakpoints.down('md')]: {
      flexGrow: 0,
      width: '100%',
    },
  },
}));

const App = (): JSX.Element => {
  return (
    <MainWrapper>
      <CssBaseline />
      <MainContainer>
        <Calculator />
        <Info />
      </MainContainer>
      <Toaster position='bottom-right' reverseOrder={false} />
    </MainWrapper>
  );
};

export default App;
