import { JSX, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  styled,
  IconButton,
} from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Calculator } from './components/calculator/Calculator.tsx';
import { Info } from './components/info/Info.tsx';
import { Settings } from '@mui/icons-material';
import { AppDrawer } from './components/common/AppDrawer.tsx';

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',

  [theme.breakpoints.down('md')]: {
    height: 'auto',
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: 0,

  [theme.breakpoints.down('md')]: {
    padding: `0 ${theme.spacing(1)}`,
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxHeight: 'calc(100vh - 64px - 8px)',
  display: 'flex',
  flexGrow: 1,
  gap: theme.spacing(2),

  [theme.breakpoints.down('md')]: {
    maxHeight: 'auto',
    flexDirection: 'column',
  },

  '& > *': {
    height: '100%',

    '&:first-child': {
      width: '40%',
    },

    '&:last-child': {
      width: '60%',
    },

    [theme.breakpoints.down('md')]: {
      height: 'auto',

      '&:first-child, &:last-child': {
        width: '100%',
      },
    },
  },
}));

const App = (): JSX.Element => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  return (
    <Wrapper>
      <AppBar component='nav'>
        <Toolbar>
          <Typography variant='h6' component='div'>
            IVS Calculator
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color={'inherit'} onClick={handleDrawerToggle}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AppDrawer isOpen={drawerOpen} onClose={handleDrawerToggle} />
      <CssBaseline />
      <MainContainer component='main'>
        <Toolbar sx={{ mb: 1 }} />
        <ContentContainer>
          <Calculator />
          <Info />
        </ContentContainer>
      </MainContainer>
      <Toaster position='bottom-right' reverseOrder={false} />
    </Wrapper>
  );
};

export default App;
