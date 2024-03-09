import { JSX } from 'react';
import { Box, CssBaseline, styled } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Calculator } from './components/calculator/Calculator.tsx';
import { Info } from './components/info/Info.tsx';

const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  gap: theme.spacing(2),

  '& > *': {
    flexGrow: 1,
    width: `calc(50% - ${theme.spacing(2)} * 0.5)`,
  },
}));

const App = (): JSX.Element => {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CssBaseline />
      <MainContainer>
        <Calculator />
        <Info />
      </MainContainer>
      <Toaster position='bottom-right' reverseOrder={false} />
    </Box>
  );
};

export default App;
